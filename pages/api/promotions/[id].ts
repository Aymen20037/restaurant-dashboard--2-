import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"
import { getIronSession } from "iron-session"
import { sessionOptions } from "@/lib/session"

type SessionUser = {
  id: string
  email: string
  name: string
  role: string
  restaurantName: string
  city?: string
}

async function getSessionUser(req: NextApiRequest, res: NextApiResponse): Promise<SessionUser> {
  const session = await getIronSession<{ user?: SessionUser }>(req, res, sessionOptions)
  if (!session.user) throw new Error("Utilisateur non connecté")
  return session.user
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (typeof id !== "string") {
    return res.status(400).json({ error: "ID invalide" })
  }

  try {
    const user = await getSessionUser(req, res)

    const promotion = await prisma.promotions.findUnique({ where: { id } })
    if (!promotion) return res.status(404).json({ error: "Promotion introuvable" })
    if (promotion.userId !== user.id) return res.status(403).json({ error: "Accès non autorisé à cette promotion" })

    if (req.method === "GET") {
      return res.status(200).json(promotion)
    }

    if (req.method === "PUT") {
      const {
        name,
        description,
        type,
        value,
        code,
        minAmount,
        maxDiscount,
        usageLimit,
        startDate,
        endDate,
        isActive,
      } = req.body

      if (
        !name || !type || !value || !startDate || !endDate ||
        typeof isActive !== "boolean"
      ) {
        return res.status(400).json({ error: "Champs obligatoires manquants ou invalides." })
      }

      const updatedPromotion = await prisma.promotions.update({
        where: { id },
        data: {
          name,
          description,
          type,
          value: parseFloat(value),
          code: code || null,
          minAmount: minAmount ? parseFloat(minAmount) : null,
          maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
          usageLimit: usageLimit ? parseInt(usageLimit, 10) : null,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          isActive,
        },
      })

      return res.status(200).json(updatedPromotion)
    }

    if (req.method === "DELETE") {
      await prisma.promotions.delete({ where: { id } })
      return res.status(204).end()
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"])
    return res.status(405).end(`Méthode ${req.method} non autorisée`)
  } catch (error: any) {
    console.error("Erreur API promotion :", error.message)
    if (error.message === "Utilisateur non connecté") {
      return res.status(401).json({ error: error.message })
    }
    return res.status(500).json({ error: "Erreur serveur" })
  }
}
