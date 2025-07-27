import type { NextApiRequest, NextApiResponse } from "next"
import { getIronSession } from "iron-session"
import { sessionOptions } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { OrderStatus } from "@prisma/client"

type SessionUser = {
  id: string
  email: string
  name: string
  role: string
  restaurantName: string
}

async function getSessionUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<SessionUser> {
  const session = await getIronSession<{ user?: SessionUser }>(req, res, sessionOptions)
  if (!session.user) throw new Error("Utilisateur non connecté")
  return session.user
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await getSessionUser(req, res)
    const { id } = req.query

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "ID de commande invalide" })
    }

    if (req.method === "PATCH") {
      const { status }: { status: OrderStatus } = req.body

      if (!status || !Object.values(OrderStatus).includes(status)) {
        return res.status(400).json({ error: "Statut invalide" })
      }

      const updated = await prisma.orders.update({
        where: { id, userId: user.id },
        data: { status },
      })

      return res.status(200).json(updated)
    }

    return res.status(405).json({ error: "Méthode non autorisée" })
  } catch (error: any) {
    console.error("Erreur API update commande:", error.message)
    return res.status(500).json({ error: error.message || "Erreur serveur" })
  }
}
