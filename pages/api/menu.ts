import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"
import { getIronSession } from "iron-session"
import { sessionOptions } from "@/lib/session"
import { z } from "zod"

const menuSettingsSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  showPrices: z.boolean().optional(),
  showDescriptions: z.boolean().optional(),
  showImages: z.boolean().optional(),
  colorTheme: z.string().optional(),
  layout: z.string().optional(),
  language: z.string().optional(),
})
export type MenuSettingsInput = z.infer<typeof menuSettingsSchema>

type UserSession = {
  id: string
  email: string
  role?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getIronSession(req, res, sessionOptions) as {
    user?: UserSession
  }

  if (!session.user) {
    return res.status(401).json({ message: "Non autorisé" })
  }

  try {
    if (req.method === "GET") {
      const menuSettings = await prisma.menu_settings.findFirst()
    
      const user = await prisma.users.findUnique({
        where: { id: session.user.id },
        select: {
          restaurantName: true,
          city: true,
          phone: true,
        },
      })
    
      return res.status(200).json({
        settings: menuSettings || null,
        user: user || null,
      })
    }
    

    if (req.method === "POST" || req.method === "PUT") {
      const parseResult = menuSettingsSchema.safeParse(req.body)

      if (!parseResult.success) {
        return res.status(400).json({
          message: "Données invalides",
          details: parseResult.error.errors,
        })
      }

      const data: MenuSettingsInput = parseResult.data

      if (req.method === "POST") {
        const created = await prisma.menu_settings.create({ data })
        return res.status(201).json(created)
      } else {
        // PUT: met à jour ou crée si aucun réglage existant
        const existing = await prisma.menu_settings.findFirst()
        if (!existing) {
          // Crée un nouvel enregistrement si aucun réglage n'existe
          const created = await prisma.menu_settings.create({ data })
          return res.status(201).json(created)
        }
        const updated = await prisma.menu_settings.update({
          where: { id: existing.id },
          data,
        })
        return res.status(200).json(updated)
      }
      
    }

    res.setHeader("Allow", ["GET", "POST", "PUT"])
    return res.status(405).end(`Méthode ${req.method} non autorisée`)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Erreur serveur" })
  }
}
