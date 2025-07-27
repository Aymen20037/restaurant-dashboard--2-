import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" }) 
  }

  try {
    const categories = await prisma.categories.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
      },
    })

    return res.status(200).json({ categories })
  } catch (error) {
    console.error("[API] Erreur récupération catégories:", error)
    return res.status(500).json({ error: "Erreur serveur" })
  }
}
