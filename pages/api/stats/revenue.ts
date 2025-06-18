import type { NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware/auth"

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" })
  }

  try {
    const { period = "30" } = req.query
    const userId = req.user.userId
    const days = Number.parseInt(period as string)

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Revenus par jour
    const revenueData = (await prisma.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        SUM(totalAmount) as revenue,
        COUNT(*) as orders
      FROM orders 
      WHERE userId = ${userId} 
        AND createdAt >= ${startDate}
        AND status IN ('DELIVERED', 'COMPLETED')
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `) as Array<{
      date: Date
      revenue: number
      orders: number
    }>

    // Revenus par catégorie
    const revenueByCategory = (await prisma.$queryRaw`
      SELECT 
        c.name as category,
        SUM(oi.price * oi.quantity) as revenue,
        SUM(oi.quantity) as quantity
      FROM order_items oi
      JOIN dishes d ON oi.dishId = d.id
      JOIN categories c ON d.categoryId = c.id
      JOIN orders o ON oi.orderId = o.id
      WHERE o.userId = ${userId}
        AND o.createdAt >= ${startDate}
        AND o.status IN ('DELIVERED', 'COMPLETED')
      GROUP BY c.id, c.name
      ORDER BY revenue DESC
    `) as Array<{
      category: string
      revenue: number
      quantity: number
    }>

    // Top plats
    const topDishes = (await prisma.$queryRaw`
      SELECT 
        d.name as dish,
        SUM(oi.quantity) as quantity,
        SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi
      JOIN dishes d ON oi.dishId = d.id
      JOIN orders o ON oi.orderId = o.id
      WHERE o.userId = ${userId}
        AND o.createdAt >= ${startDate}
        AND o.status IN ('DELIVERED', 'COMPLETED')
      GROUP BY d.id, d.name
      ORDER BY quantity DESC
      LIMIT 10
    `) as Array<{
      dish: string
      quantity: number
      revenue: number
    }>

    res.status(200).json({
      revenueData: revenueData.map((item) => ({
        date: item.date.toISOString().split("T")[0],
        revenue: Number(item.revenue),
        orders: Number(item.orders),
      })),
      revenueByCategory: revenueByCategory.map((item) => ({
        category: item.category,
        revenue: Number(item.revenue),
        quantity: Number(item.quantity),
      })),
      topDishes: topDishes.map((item) => ({
        dish: item.dish,
        quantity: Number(item.quantity),
        revenue: Number(item.revenue),
      })),
    })
  } catch (error) {
    console.error("Erreur récupération revenus:", error)
    res.status(500).json({ error: "Erreur serveur" })
  }
}

export default withAuth(handler)
