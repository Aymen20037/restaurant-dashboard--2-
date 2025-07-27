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

type KpiResponse = {
  commandesCeMois: number;
  nouveauxClients: number;
  platsCommandes: number;
  tauxSatisfaction: number; 
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
  res: NextApiResponse<KpiResponse | { error: string }>
) {
  try {
    const user = await getSessionUser(req, res);

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Méthode non autorisée" });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const commandesCeMois = await prisma.orders.count({
      where: {
        userId: user.id,
        status: {
          in: ["CONFIRMED", "PREPARING", "READY", "DELIVERED"],
        },
        createdAt: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
    });

    const nouveauxClients = await prisma.customers.count({
      where: {
        orders: {
          some: {
            userId: user.id,
            createdAt: {
              gte: startOfMonth,
              lt: endOfMonth,
            },
          },
        },
      },
    });

    const platsCommandesAgg = await prisma.order_items.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        orders: {
          userId: user.id,
          status: {
            in: ["CONFIRMED", "PREPARING", "READY", "DELIVERED"],
          },
          createdAt: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
        },
      },
    });
    const platsCommandes = platsCommandesAgg._sum.quantity ?? 0;

    const avgRatingAgg = await prisma.reviews.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        userId: user.id,
        isVisible: true,
      },
    });
    const tauxSatisfaction = avgRatingAgg._avg.rating
      ? Math.round(avgRatingAgg._avg.rating * 20) 
      : 0;

    const kpi: KpiResponse = {
      commandesCeMois,
      nouveauxClients,
      platsCommandes,
      tauxSatisfaction,
    };

    return res.status(200).json(kpi);
  } catch (error: any) {
    console.error("Erreur API KPI:", error.message);
    if (error.message === "Utilisateur non connecté") {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
