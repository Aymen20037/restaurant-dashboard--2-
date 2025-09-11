import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session"; 
import { prisma } from "@/lib/prisma";
import { compagneSchema } from "@/lib/validations/compagne";

type SessionUser = {
  id: string;
  email: string;
  name: string;
};

async function getSessionUser(req: NextApiRequest, res: NextApiResponse): Promise<SessionUser> {
  const session = await getIronSession<{ user?: SessionUser }>(req, res, sessionOptions);
  if (!session.user) throw new Error("Utilisateur non connecté");
  return session.user;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await getSessionUser(req, res);

    const { id, type } = req.query;

    if (req.method === "GET" && !id) {
      const campagnes = await prisma.campagnes.findMany({
        where: { 
          userId: user.id,
          ...(type ? { type: String(type) } : {}), 
        },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(campagnes);
    }

    if (req.method === "POST") {
      const parseResult = compagneSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ errors: parseResult.error.errors });
      }
      const data = parseResult.data;

      const newCampaign = await prisma.campagnes.create({
        data: {
          name: data.name,
          type: data.type,
          status: data.status,
          budget: data.budget,
          spent: data.spent,
          impressions: data.impressions,
          clicks: data.clicks,
          conversions: data.conversions,
          startDate: data.startDate,
          endDate: data.endDate,
          targetAudience: data.targetAudience,
          userId: user.id, 
        },
      });

      return res.status(201).json(newCampaign);
    }

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "ID invalide ou manquant." });
    }

    if (req.method === "GET") {
      const campagne = await prisma.campagnes.findUnique({ where: { id } });
      if (!campagne) return res.status(404).json({ error: "Campagne introuvable." });
      if (campagne.userId !== user.id) return res.status(403).json({ error: "Accès refusé" });
      return res.status(200).json(campagne);
    }

    if (req.method === "PUT") {
      const updateSchema = compagneSchema.omit({ userId: true }).partial();
      const parseResult = updateSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ errors: parseResult.error.errors });
      }
      const data = parseResult.data;
    
      if (data.startDate) data.startDate = new Date(data.startDate);
      if (data.endDate) data.endDate = new Date(data.endDate);
    
      const campagne = await prisma.campagnes.findUnique({ where: { id } });
      if (!campagne) return res.status(404).json({ error: "Campagne introuvable." });
      if (campagne.userId !== user.id) return res.status(403).json({ error: "Accès refusé" });
    
      const updated = await prisma.campagnes.update({
        where: { id },
        data,
      });
    
      return res.status(200).json(updated);
    }
    
    if (req.method === "DELETE") {
      const campagne = await prisma.campagnes.findUnique({ where: { id } });
      if (!campagne) return res.status(404).json({ error: "Campagne introuvable." });
      if (campagne.userId !== user.id) return res.status(403).json({ error: "Accès refusé" });

      await prisma.campagnes.delete({ where: { id } });
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  } catch (error: any) {
    console.error("Erreur API campagnes:", error);
    return res.status(500).json({ error: error.message || "Erreur serveur." });
  }
}
