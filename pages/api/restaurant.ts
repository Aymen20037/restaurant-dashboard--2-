import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { prisma } from "@/lib/prisma";

type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  restaurantName: string;
};

async function getSessionUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<SessionUser> {
  const session = await getIronSession<{
    user?: SessionUser;
  }>(req, res, sessionOptions);

  if (!session.user) {
    throw new Error("Utilisateur non connecté");
  }

  return session.user;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const user = await getSessionUser(req, res);

    if (req.method === "GET") {
      const restaurant = await prisma.users.findUnique({
        where: { id: user.id },
        select: {
          restaurantName: true,
          description: true,
          address: true,
          phone: true,
          email: true,
          hours: true,
          isOpen: true,
          deliveryRadius: true,
          minimumOrder: true,
          logo :true
        },
      });

      if (!restaurant) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      return res.status(200).json(restaurant);
    }

    if (req.method === "PUT") {
      const data = req.body;


      const updated = await prisma.users.update({
        where: { id: user.id },
        data: {
          restaurantName: data.restaurantName,
          description: data.description,
          address: data.address,
          phone: data.phone,
          email: data.email,
          hours: data.hours,
          isOpen: data.isOpen,
          deliveryRadius: data.deliveryRadius,
          minimumOrder: parseFloat(data.minimumOrder),
          logo: data.logo ? data.logo : undefined, 
        },
      });

      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: "Méthode non autorisée" });
  } catch (error: any) {
    console.error("Erreur API Restaurant:", error.message);
    return res.status(500).json({
      error: error.message || "Erreur serveur",
    });
  }
}
