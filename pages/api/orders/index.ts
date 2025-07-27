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

type OrderItemType = {
  name: string
  price: number
  quantity: number
}

type FormattedOrder = {
  id: string
  orderNumber: string
  status: OrderStatus
  totalAmount: number
  createdAt: string
  deliveryTime: string | null
  client: string
  phone: string | null
  address: string | null
  items: OrderItemType[]
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

    if (req.method === "GET") {
      const orders = await prisma.orders.findMany({
        where: { userId: user.id },
        include: {
          customers: true,
          order_items: {
            include: {
              dishes: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })

      const formatted: FormattedOrder[] = orders.map((orders) => ({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        totalAmount: Number(orders.totalAmount),
        createdAt: orders.createdAt.toISOString(),
        deliveryTime: orders.deliveryTime?.toISOString().slice(11, 16) ?? null,
        client: orders.customers.name,
        phone: orders.customers.phone ?? null,
        address: orders.deliveryAddress ?? null,
        items: orders.order_items.map((item) => ({
          name: item.dishes.name,
          quantity: item.quantity,
          price: Number(item.price),
        })),
      }))

      return res.status(200).json(formatted)
    }

    return res.status(405).json({ error: "Méthode non autorisée" })
  } catch (error: any) {
    console.error("Erreur API commandes:", error.message)
    return res.status(500).json({ error: error.message || "Erreur serveur" })
  }
}
