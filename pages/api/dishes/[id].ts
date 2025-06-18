import type { NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware/auth"
import { updateDishSchema } from "@/lib/validations/dish"

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { method } = req
  const { id } = req.query

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID invalide" })
  }

  switch (method) {
    case "GET":
      return getDish(req, res, id)
    case "PUT":
      return updateDish(req, res, id)
    case "DELETE":
      return deleteDish(req, res, id)
    default:
      return res.status(405).json({ error: "Méthode non autorisée" })
  }
}

async function getDish(req: AuthenticatedRequest, res: NextApiResponse, id: string) {
  try {
    const dish = await prisma.dish.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
      include: {
        category: true,
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    })

    if (!dish) {
      return res.status(404).json({ error: "Plat non trouvé" })
    }

    res.status(200).json({ dish })
  } catch (error) {
    console.error("Erreur récupération plat:", error)
    res.status(500).json({ error: "Erreur serveur" })
  }
}

async function updateDish(req: AuthenticatedRequest, res: NextApiResponse, id: string) {
  try {
    const validatedData = updateDishSchema.parse(req.body)

    const dish = await prisma.dish.updateMany({
      where: {
        id,
        userId: req.user.userId,
      },
      data: validatedData,
    })

    if (dish.count === 0) {
      return res.status(404).json({ error: "Plat non trouvé" })
    }

    const updatedDish = await prisma.dish.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })

    res.status(200).json({
      message: "Plat mis à jour avec succès",
      dish: updatedDish,
    })
  } catch (error) {
    console.error("Erreur mise à jour plat:", error)
    if (error instanceof Error && error.message.includes("validation")) {
      return res.status(400).json({ error: "Données invalides" })
    }
    res.status(500).json({ error: "Erreur serveur" })
  }
}

async function deleteDish(req: AuthenticatedRequest, res: NextApiResponse, id: string) {
  try {
    const dish = await prisma.dish.deleteMany({
      where: {
        id,
        userId: req.user.userId,
      },
    })

    if (dish.count === 0) {
      return res.status(404).json({ error: "Plat non trouvé" })
    }

    res.status(200).json({
      message: "Plat supprimé avec succès",
    })
  } catch (error) {
    console.error("Erreur suppression plat:", error)
    res.status(500).json({ error: "Erreur serveur" })
  }
}

export default withAuth(handler)
