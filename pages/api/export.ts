import type { NextApiRequest, NextApiResponse } from "next"
import { getIronSession } from "iron-session"
import { sessionOptions } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { parse } from "json2csv"
import type {
  orders as Order,
  customers as Customer,
  payments as Payment,
  reviews as Review,
  users as User,
  order_items as OrderItem,
  dishes as Dish
} from "@prisma/client"

export const config = {
  api: {
    bodyParser: true,
  },
}

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

type ExportRequestBody = {
  format?: "csv" | "json"
  period?: "week" | "month" | "quarter" | "year" | "custom"
  startDate?: string
  endDate?: string
  includeOrders?: boolean
  includeCustomers?: boolean
  includePayments?: boolean
  includeReviews?: boolean
}

type CSVFile = {
  name: string
  content: string
}

type ExportResponseData = {
  orders?: (Order & {
    customers: Customer | null
    order_items: (OrderItem & { dishes: Dish })[]
  })[]
  customers?: Customer[]
  payments?: (Payment & { orders: Order })[]
  reviews?: (Review & { customers: Customer; users: User })[]
}

type ExportResponse =
  | {
      format: "csv"
      files: CSVFile[]
    }
  | {
      format: "json"
      data: ExportResponseData
    }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExportResponse | { message: string; error?: any }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" })
  }

  try {
    const user = await getSessionUser(req, res)

    const {
      format = "csv",
      period = "month",
      startDate,
      endDate,
      includeOrders,
      includeCustomers,
      includePayments,
      includeReviews,
    }: ExportRequestBody = req.body

    const dateFilter: { gte?: Date; lte?: Date } = {}

    if (period === "custom" && startDate && endDate) {
      dateFilter.gte = new Date(startDate)
      dateFilter.lte = new Date(endDate)
    } else {
      const now = new Date()
      const from = new Date()
      switch (period) {
        case "week":
          from.setDate(now.getDate() - 7)
          break
        case "month":
          from.setMonth(now.getMonth() - 1)
          break
        case "quarter":
          from.setMonth(now.getMonth() - 3)
          break
        case "year":
          from.setFullYear(now.getFullYear() - 1)
          break
      }
      dateFilter.gte = from
      dateFilter.lte = now
    }

    const result: ExportResponseData = {}

    if (includeOrders) {
      result.orders = await prisma.orders.findMany({
        where: {
          createdAt: dateFilter,
          userId: user.id,
        },
        include: {
          customers: true,
          order_items: { include: { dishes: true } },
        },
      })
    }

    if (includeCustomers) {
      result.customers = await prisma.customers.findMany({
        where: {
          createdAt: dateFilter,
          userId: user.id,
        },
      })
    }

    if (includePayments) {
      result.payments = await prisma.payments.findMany({
        where: {
          createdAt: dateFilter,
          userId: user.id,
        },
        include: {
          orders: true,
        },
      })
    }

    if (includeReviews) {
      result.reviews = await prisma.reviews.findMany({
        where: {
          createdAt: dateFilter,
          userId: user.id,
        },
        include: {
          customers: true,
          users: true,
        },
      })
    }

    if (format === "csv") {
      const files: CSVFile[] = []

      for (const [key, data] of Object.entries(result)) {
        if (!data || (Array.isArray(data) && data.length === 0)) continue

        let csvContent: string
        try {
          csvContent = parse(data as any[])
        } catch (e) {
          const fields = Object.keys((data as any[])[0] || {})
          csvContent = parse(data as any[], { fields })
        }

        files.push({ name: `${key}.csv`, content: csvContent })
      }

      return res.status(200).json({ format: "csv", files })
    } else {
      return res.status(200).json({ format: "json", data: result })
    }
  } catch (error: any) {
    console.error("Erreur d’export :", error.message)
    return res.status(500).json({ message: "Erreur serveur", error: error.message })
  }
}
