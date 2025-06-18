import type { NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware/auth"

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" })
  }

  try {
    const userId = req.user.userId
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Commandes ce mois
    const ordersThisMonth = await prisma.order.count({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    })

    const ordersLastMonth = await prisma.order.count({
      where: {
        userId,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    })

    // Nouveaux clients
    const newCustomersThisMonth = await prisma.customer.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
        orders: {
          some: {
            userId,
          },
        },
      },
    })

    const newCustomersLastMonth = await prisma.customer.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
        orders: {
          some: {
            userId,
          },
        },
      },
    })

    // Plats commandés
    const dishesOrderedThisMonth = await prisma.orderItem.aggregate({
      where: {
        order: {
          userId,
          createdAt: {
            gte: startOfMonth,
          },
        },
      },
      _sum: {
        quantity: true,
      },
    })

    const dishesOrderedLastMonth = await prisma.orderItem.aggregate({
      where: {
        order: {
          userId,
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
      },
      _sum: {
        quantity: true,
      },
    })

    // Taux de satisfaction
    const reviews = await prisma.review.aggregate({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
        },
      },
      _avg: {
        rating: true,
      },
      _count: true,
    })

    const reviewsLastMonth = await prisma.review.aggregate({
      where: {
        userId,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      _avg: {
        rating: true,
      },
    })

    // Calcul des pourcentages de changement
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return ((current - previous) / previous) * 100
    }

    res.status(200).json({
      ordersThisMonth: {
        value: ordersThisMonth,
        change: calculateChange(ordersThisMonth, ordersLastMonth),
      },
      newCustomers: {
        value: newCustomersThisMonth,
        change: calculateChange(newCustomersThisMonth, newCustomersLastMonth),
      },
      dishesOrdered: {
        value: dishesOrderedThisMonth._sum.quantity || 0,
        change: calculateChange(dishesOrderedThisMonth._sum.quantity || 0, dishesOrderedLastMonth._sum.quantity || 0),
      },
      satisfaction: {
        value: reviews._avg.rating ? Math.round(reviews._avg.rating * 100) / 100 : 0,
        change: calculateChange(reviews._avg.rating || 0, reviewsLastMonth._avg.rating || 0),
        count: reviews._count,
      },
    })
  } catch (error) {
    console.error("Erreur récupération statistiques:", error)
    res.status(500).json({ error: "Erreur serveur" })
  }
}

export default withAuth(handler)
