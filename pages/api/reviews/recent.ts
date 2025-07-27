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

type RecentReview = {
  id: string;
  client: string;
  restaurant: string;
  note: number;
  commentaire: string;
  date: string;
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
  res: NextApiResponse<RecentReview[] | { error: string }>
) {
  try {
    const user = await getSessionUser(req, res);

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Méthode non autorisée" });
    }

    const recentReviews = await prisma.reviews.findMany({
      where: {
        userId: user.id,
        isVisible: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        customers: { select: { name: true } },
        users: { select: { restaurantName: true } },
      },
    });

    const reviews: RecentReview[] = recentReviews.map((review) => ({
      id: review.id,
      client: review.customers.name,
      restaurant: review.users.restaurantName ?? "Mon Restaurant",
      note: review.rating,
      commentaire: review.comment ?? "",
      date: review.createdAt.toISOString().slice(0, 10),
    }));

    return res.status(200).json(reviews);
  } catch (error: any) {
    console.error("Erreur API avis récents:", error.message);
    if (error.message === "Utilisateur non connecté") {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
