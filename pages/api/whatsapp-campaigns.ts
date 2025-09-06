import type { NextApiRequest, NextApiResponse } from "next"
import { getIronSession } from "iron-session"
import { sessionOptions } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import type { campagnes as Campagne } from "@prisma/client"

type SessionUser = {
  id: string
  email: string
  name: string
  role: string
  restaurantName: string
}

type WhatsAppCampaignResponse =
  | { campaigns: Campagne[] }
  | { error: string }

async function getSessionUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<SessionUser> {
  const session = await getIronSession<{ user?: SessionUser }>(req, res, sessionOptions)
  if (!session.user) {
    throw new Error("Utilisateur non connecté")
  }
  return session.user
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WhatsAppCampaignResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" })
  }

  try {
    const user = await getSessionUser(req, res)

    const campaigns = await prisma.campagnes.findMany({
      where: {
        type: "Whatsapp Business",
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return res.status(200).json({ campaigns })
  } catch (error: any) {
    console.error("Erreur récupération campagnes WhatsApp :", error)
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "Erreur serveur inconnue",
    })
  }
}
