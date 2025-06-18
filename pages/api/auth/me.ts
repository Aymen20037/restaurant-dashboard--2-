import type { NextApiResponse } from "next"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware/auth"

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" })
  }

  try {
    // Vérifier si l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({ error: "Utilisateur non authentifié" })
    }

    const { password: _, ...userWithoutPassword } = req.user.userData

    res.status(200).json({
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Erreur récupération profil:", error)
    res.status(500).json({ error: "Erreur serveur" })
  }
}

export default withAuth(handler)
