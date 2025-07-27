import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"
import { Decimal } from "@prisma/client/runtime/library"

interface RevenusStats {
  total: number
  evolution: string
}

interface CommandesStats {
  total: number
  evolution: string
}

interface ClientsStats {
  actifs: number
  evolution: string
}

interface NoteMoyenneStats {
  valeur: string
  evolution: string
}

interface TopPlatsStats {
  labels: string[]
  data: number[]
}

interface SegmentationClientsStats {
  nouveaux: number
  regulier: number
  vip: number
}

interface PerformanceStats {
  tempsPreparationMoyen: number
  tauxLivraison: string
  panierMoyen: number
}

interface DashboardStats {
  revenus: RevenusStats
  commandes: CommandesStats
  clients: ClientsStats
  noteMoyenne: NoteMoyenneStats
  ventesParMois: number[]
  topPlats: TopPlatsStats
  segmentationClients: SegmentationClientsStats
  commandesParHeure: number[]
  performance: PerformanceStats
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardStats | { error: string }>
) {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

    const revenusCeMoisRaw = await prisma.orders.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: startOfMonth }, paymentStatus: "COMPLETED" },
    })
    const revenusMoisDernierRaw = await prisma.orders.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }, paymentStatus: "COMPLETED" },
    })
    const revenusCeMois = Number(revenusCeMoisRaw._sum.totalAmount ?? 0)
    const revenusMoisDernier = Number(revenusMoisDernierRaw._sum.totalAmount ?? 0)
    const revenusEvolution = revenusMoisDernier > 0
      ? ((revenusCeMois - revenusMoisDernier) / revenusMoisDernier) * 100
      : 100

    const commandesCeMois = await prisma.orders.count({
      where: { createdAt: { gte: startOfMonth }, paymentStatus: "COMPLETED" },
    })
    const commandesMoisDernier = await prisma.orders.count({
      where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }, paymentStatus: "COMPLETED" },
    })
    const commandesEvolution = commandesMoisDernier > 0
      ? ((commandesCeMois - commandesMoisDernier) / commandesMoisDernier) * 100
      : 100

    const clientsCeMois = await prisma.orders.findMany({
      where: { createdAt: { gte: startOfMonth }, paymentStatus: "COMPLETED" },
      distinct: ["customerId"],
      select: { customerId: true },
    })
    const clientsMoisDernier = await prisma.orders.findMany({
      where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }, paymentStatus: "COMPLETED" },
      distinct: ["customerId"],
      select: { customerId: true },
    })
    const nbClientsCeMois = clientsCeMois.length
    const nbClientsMoisDernier = clientsMoisDernier.length
    const clientsEvolution = nbClientsMoisDernier > 0
      ? ((nbClientsCeMois - nbClientsMoisDernier) / nbClientsMoisDernier) * 100
      : 100

    const reviewAvg = await prisma.reviews.aggregate({
      _avg: { rating: true },
      where: { isVisible: true },
    })
    const avgRating = reviewAvg._avg.rating ?? 0
    const ratingEvolution = 0.2 

    const ventesParMoisRaw = await prisma.$queryRaw<
      { month: number; total: string }[]
    >`
      SELECT MONTH(createdAt) as month, SUM(totalAmount) as total
      FROM \`Orders\`
      WHERE createdAt >= ${startOfYear} AND createdAt <= ${endOfYear} AND paymentStatus = 'COMPLETED'
      GROUP BY month
      ORDER BY month
    `
    const ventesParMois = new Array(12).fill(0)
    ventesParMoisRaw.forEach(({ month, total }) => {
      ventesParMois[month - 1] = Number(total)
    })

    // Top plats commandés (top 6)
    const topPlatsRaw = await prisma.order_items.groupBy({
      by: ["dishId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 6,
    })
    const dishIds = topPlatsRaw.map(t => t.dishId)
    const dishes = await prisma.dishes.findMany({
      where: { id: { in: dishIds } },
      select: { id: true, name: true },
    })
    const topPlats = topPlatsRaw.map(tp => {
      const dish = dishes.find(d => d.id === tp.dishId)
      return {
        name: dish?.name ?? "Inconnu",
        quantity: tp._sum.quantity ?? 0,
      }
    })

    const newClientsCount = await prisma.customers.count({
      where: {
        orders: {
          some: { createdAt: { gte: startOfMonth } },
          none: { createdAt: { lt: startOfMonth } },
        },
      },
    })
    const clientsWithOrders = await prisma.customers.findMany({ include: { orders: true } })
    const regularClientsCount = clientsWithOrders.filter(c => c.orders.length > 1).length
    const vipClientsCount = clientsWithOrders.filter(c => c.orders.length > 5).length

    const ordersTodayRaw = await prisma.orders.findMany({
      where: { createdAt: { gte: startOfToday, lte: endOfToday }, paymentStatus: "COMPLETED" },
      select: { createdAt: true },
    })
    const commandesParHeure = new Array(24).fill(0)
    ordersTodayRaw.forEach(order => {
      commandesParHeure[order.createdAt.getHours()]++
    })

    const avgPrepTime = await prisma.dishes.aggregate({
      _avg: { preparationTime: true },
    })

    const totalDelivered = await prisma.orders.count({ where: { status: "DELIVERED" } })
    const onTimeDelivered = await prisma.orders.count({
      where: {
        status: "DELIVERED",
       
      },
    })
    const deliveryRate = totalDelivered > 0 ? (onTimeDelivered / totalDelivered) * 100 : 0

    const avgPanier = await prisma.orders.aggregate({
      _avg: { totalAmount: true },
      where: { paymentStatus: "COMPLETED" },
    })

    const response: DashboardStats = {
      revenus: {
        total: revenusCeMois,
        evolution: revenusEvolution.toFixed(1),
      },
      commandes: {
        total: commandesCeMois,
        evolution: commandesEvolution.toFixed(1),
      },
      clients: {
        actifs: nbClientsCeMois,
        evolution: clientsEvolution.toFixed(1),
      },
      noteMoyenne: {
        valeur: avgRating.toFixed(1),
        evolution: ratingEvolution.toFixed(1),
      },
      ventesParMois,
      topPlats: {
        labels: topPlats.map(p => p.name),
        data: topPlats.map(p => p.quantity),
      },
      segmentationClients: {
        nouveaux: newClientsCount,
        regulier: regularClientsCount,
        vip: vipClientsCount,
      },
      commandesParHeure: commandesParHeure.slice(8, 23), 
      performance: {
        tempsPreparationMoyen: avgPrepTime._avg.preparationTime ?? 0,
        tauxLivraison: deliveryRate.toFixed(0),
        panierMoyen: avgPanier._avg.totalAmount instanceof Decimal ? avgPanier._avg.totalAmount.toNumber() : 0,
      },
    }

    return res.status(200).json(response)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Erreur serveur" })
  }
}
