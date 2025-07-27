import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { prisma } from "@/lib/prisma";

type SessionUser = {
  id: string;
  email: string;
};

async function getSessionUser(req: NextApiRequest, res: NextApiResponse): Promise<SessionUser> {
  const session = await getIronSession<{ user?: SessionUser }>(req, res, sessionOptions);

  if (!session.user) throw new Error("Utilisateur non connecté");
  return session.user;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await getSessionUser(req, res);

    if (req.method === "GET") {
      const userData = await prisma.users.findUnique({
        where: { id: user.id },
        select: {
          restaurantName: true,
          description: true,
            customMessage: true,
        },
      });

      if (!userData) return res.status(404).json({ error: "Utilisateur non trouvé" });

      return res.status(200).json(userData);
    }

    if (req.method === "PUT") {
      const { restaurantName, description, customMessage } = req.body;

      const updated = await prisma.users.update({
        where: { id: user.id },
        data: {
          restaurantName,
          description,
          customMessage,
        },
      });
      if (req.method === "PUT") {
        const { description, customMessage } = req.body
    
        const updated = await prisma.users.update({
          where: { id: user.id },
          data: {
            description,
            customMessage,
          },
        })
    
        return res.status(200).json({ message: "Modifications enregistrées", updated })
      }

      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: "Méthode non autorisée" });
  } catch (error: any) {
    console.error("Erreur API Restaurant:", error.message);
    return res.status(500).json({ error: error.message || "Erreur serveur" });
  }
}
