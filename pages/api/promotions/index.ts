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
  try {
    const user = await getSessionUser(req, res)

    if (req.method === "GET") {
      const promotions = await prisma.promotions.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      })
      return res.status(200).json(promotions)
    }

    if (req.method === "POST") {
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
        [
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
        ].some((field) => field === undefined || field === null || field === "") ||
        typeof isActive !== "boolean"
      ) {
        return res.status(400).json({ error: "Les champs obligatoires sont manquants." })
      }

      const newPromotion = await prisma.promotions.create({
        data: {
          name,
          description,
          type,
          code,
          value: parseFloat(value),
          minAmount: parseFloat(minAmount),
          maxDiscount: parseFloat(maxDiscount),
          usageLimit: parseInt(usageLimit, 10),
          usageCount: 0,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          isActive,
          userId: user.id,
        },
      })

      return res.status(201).json(newPromotion)
    }

    res.setHeader("Allow", ["GET", "POST"])
    return res.status(405).end(`Méthode ${req.method} non autorisée`)
  } catch (error: any) {
    console.error("Erreur API promotions:", error.message)
    if (error.message === "Utilisateur non connecté") {
      return res.status(401).json({ error: error.message })
    }
    return res.status(500).json({ error: "Erreur serveur" })
  }
}
