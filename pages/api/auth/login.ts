import type { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signToken } from "@/lib/jwt"
import { loginSchema } from "@/lib/validations/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" })
  }

  try {
    const { email, password } = loginSchema.parse(req.body)

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" })
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" })
    }

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      return res.status(401).json({ error: "Compte désactivé" })
    }

    // Générer le token JWT
    const token = signToken(user.id)

    // Retourner les données utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Erreur de connexion:", error)
    if (error instanceof Error && error.message.includes("validation")) {
      return res.status(400).json({ error: "Données invalides" })
    }
    res.status(500).json({ error: "Erreur serveur" })
  }
}
