import type { NextApiRequest, NextApiResponse } from "next"
import { getIronSession } from "iron-session"
import { prisma } from "@/lib/prisma"
import { sessionOptions } from "@/lib/session"

// Typage utilisateur session
interface SessionUser {
  id: string
  email: string
  name: string
  role: string
  restaurantName?: string
}

async function getSessionUser(req: NextApiRequest, res: NextApiResponse): Promise<SessionUser> {
  const session = await getIronSession<{ user?: SessionUser }>(req, res, sessionOptions)
  if (!session.user) throw new Error("Utilisateur non connecté")
  return session.user
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await getSessionUser(req, res)

    switch (req.method) {
      case "GET": {
        const reviews = await prisma.reviews.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          include: {
            customers: true,
          },
        })

        const formatted = reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          date: r.createdAt,
          response: null, 
          client: r.customers.name,
          avatar: "/placeholder.svg", 
          order: "Commande test", 
          helpful: 0, 
          notHelpful: 0,
        }))

        return res.status(200).json(formatted)
      }

      case "POST": {
        const { reviewId, response } = req.body
        if (!reviewId || !response) {
          return res.status(400).json({ error: "Champs requis manquants" })
        }

        const updated = await prisma.reviews.update({
          where: { id: reviewId },
          data: { comment: response }, 
        })

        return res.status(200).json(updated)
      }

      default:
        return res.status(405).json({ error: "Méthode non autorisée" })
    }
  } catch (err: any) {
    console.error("Erreur API /api/reviews:", err)
    return res.status(500).json({ error: err.message || "Erreur serveur" })
  }
}
