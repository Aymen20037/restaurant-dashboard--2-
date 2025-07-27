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

type OrdersData = {
  day: string;    
  count: number;  
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
  if (!session.user) throw new Error("Utilisateur non connecté");
  return session.user;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OrdersData[] | { error: string }>
) {
  try {
    const user = await getSessionUser(req, res);

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Méthode non autorisée" });
    }

    const now = new Date();
    const dayOfWeek = now.getDay(); 
    const diffToMonday = (dayOfWeek + 6) % 7; 
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() - diffToMonday);

    const weekDates = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });

    // Récupérer commandes de la semaine pour ce user/restaurant
    const orders = await prisma.orders.findMany({
      where: {
        userId: user.id,
        status: { in: ["CONFIRMED", "PREPARING", "READY", "DELIVERED"] },
        createdAt: {
          gte: monday,
          lt: new Date(monday.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      },
      select: {
        createdAt: true,
      },
    });

    const ordersCountByDay: Record<string, number> = {};
    orders.forEach(({ createdAt }) => {
      const dateKey = createdAt.toISOString().slice(0, 10);
      ordersCountByDay[dateKey] = (ordersCountByDay[dateKey] ?? 0) + 1;
    });

    const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

    const ordersData: OrdersData[] = weekDates.map((date, i) => {
      const key = date.toISOString().slice(0, 10);
      return {
        day: dayLabels[i],
        count: ordersCountByDay[key] ?? 0,
      };
    });

    res.status(200).json(ordersData);
  } catch (error: any) {
    console.error("Erreur API stats orders:", error.message);
    if (error.message === "Utilisateur non connecté") {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
