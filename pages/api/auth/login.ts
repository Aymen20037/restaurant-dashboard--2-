import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/session";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
      restaurantName: string;
      city?: string;
      cuisineIds?: string[]; // facultatif selon besoin
    };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { email, password } = loginSchema.parse(req.body);

    // Changement ici : prisma.users (pas prisma.user)
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user || !user.password) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Compte désactivé" });
    }

    const session = await getIronSession<IronSessionData>(req, res, sessionOptions);
    session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      restaurantName: user.restaurantName || "",
      city: user.city || "Inconnue",
    };
    await session.save();

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: "Connexion réussie",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur de connexion:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Données invalides" });
    }

    return res.status(500).json({ error: "Erreur serveur lors de la connexion" });
  }
}
