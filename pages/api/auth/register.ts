import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { ZodError } from "zod";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
      restaurantName: string;
      city?: string;
      cuisineIds?: string[]; 
    };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const {
      email,
      password,
      name,
      phone,
      restaurantName,
      address,
      city,
      postalCode,
      description,
      cuisineIds,
    } = registerSchema.parse(req.body);

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    const cuisinesExist = await prisma.cuisine.findMany({
      where: {
        id: { in: cuisineIds },
      },
    });

    if (cuisinesExist.length !== cuisineIds.length) {
      return res.status(400).json({
        error: "Certaines cuisines sélectionnées sont invalides ou n'existent pas.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const validCuisineIds = cuisinesExist.map(c => c.id);

    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        restaurantName,
        address,
        city,
        postalCode,
        description,
        role: "RESTAURANT",
        cuisine: {
          connect: validCuisineIds.map(id => ({ id })),
        },
      },
    });

    const session = await getIronSession<IronSessionData>(req, res, sessionOptions);
    session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      restaurantName: user.restaurantName || "",
      city: user.city || "Inconnue",
      cuisineIds,
    };
    await session.save();

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: "Inscription réussie",
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
    }
    console.error("Erreur d'inscription:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
