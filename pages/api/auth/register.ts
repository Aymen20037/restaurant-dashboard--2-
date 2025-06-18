import { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signToken } from "@/lib/jwt"
import { registerSchema } from "@/lib/validations/auth"

// Backend : register.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Méthode HTTP reçue :", req.method);  // Log de la méthode HTTP

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const validatedData = registerSchema.parse(req.body);
    console.log("Données validées :", validatedData);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    const user = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
        role: "RESTAURANT", 
      },
    });

    const token = signToken(user.id);

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: "Inscription réussie",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

