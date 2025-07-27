import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { prisma } from "@/lib/prisma";

type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  restaurantName?: string;
};

type RecentOrder = {
  id: string;
  client: string;
  plat: string;
  prix: string;
  date: string;
  status: string;
};

async function getSessionUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<SessionUser> {
  const session = await getIronSession<{ user?: SessionUser }>(
    req,
    res,
    sessionOptions
  );
  if (!session.user) {
    throw new Error("Utilisateur non connecté");
  }
  return session.user;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RecentOrder[] | { error: string }>
) {
  try {
    const user = await getSessionUser(req, res);

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Méthode non autorisée" });
    }

    const recentOrders = await prisma.orders.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        orderNumber: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        customers: { select: { name: true } },
        order_items: {
          take: 1,
          select: { dishes: { select: { name: true } } },
        },
      },
    });

    const orders: RecentOrder[] = recentOrders.map((order) => ({
      id: order.orderNumber,
      client: order.customers.name,
      plat: order.order_items[0]?.dishes.name ?? "Plat inconnu",
      prix: `${order.totalAmount.toFixed(2)} DH`,
      date: order.createdAt.toISOString().slice(0, 10),
      status: order.status.toLowerCase(),
    }));

    return res.status(200).json(orders);
  } catch (error: any) {
    console.error("Erreur API commandes récentes:", error.message);
    if (error.message === "Utilisateur non connecté") {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
