import type { NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware/auth"
import { createDishSchema } from "@/lib/validations/dish"

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case "GET":
      return getDishes(req, res)
    case "POST":
      return createDish(req, res)
    default:
      return res.status(405).json({ error: "Méthode non autorisée" })
  }
}

async function getDishes(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const { page = 1, limit = 10, category, search, available } = req.query

    const where: any = {
      userId: req.user.userId,
    }

    if (category) {
      where.categoryId = category
    }

    if (search) {
      where.OR = [{ name: { contains: search as string } }, { description: { contains: search as string } }]
    }

    if (available !== undefined) {
      where.isAvailable = available === "true"
    }

    const dishes = await prisma.dish.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: {
        createdAt: "desc",
      },
    })

    const total = await prisma.dish.count({ where })

    res.status(200).json({
      dishes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    console.error("Erreur récupération plats:", error)
    res.status(500).json({ error: "Erreur serveur" })
  }
}

async function createDish(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const validatedData = createDishSchema.parse(req.body)

    const dish = await prisma.dish.create({
      data: {
        ...validatedData,
        userId: req.user.userId,
      },
      include: {
        category: true,
      },
    })

    res.status(201).json({
      message: "Plat créé avec succès",
      dish,
    })
  } catch (error) {
    console.error("Erreur création plat:", error)
    if (error instanceof Error && error.message.includes("validation")) {
      return res.status(400).json({ error: "Données invalides" })
    }
    res.status(500).json({ error: "Erreur serveur" })
  }
}

export default withAuth(handler)
