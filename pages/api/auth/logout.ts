import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
      restaurantName: string;
      city?: string; 
      cuisineIds?: string[]; // facultatif selon besoin
    };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const session = await getIronSession(req, res, sessionOptions);
  await session.destroy(); 

  return res.status(200).json({ message: "Déconnecté avec succès" });
}
