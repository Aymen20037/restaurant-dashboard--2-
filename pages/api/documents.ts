import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  restaurantName: string;
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
      const documents = await prisma.legaldocuments.findMany({
        where: { userId: user.id },
        orderBy: { name: "asc" },
      });
      return res.status(200).json(documents);
    }

    if (req.method === "POST" || req.method === "PUT") {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      fs.mkdirSync(uploadDir, { recursive: true });

      const form = formidable({
        multiples: false,
        uploadDir,
        keepExtensions: true,
      });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Erreur formidable:", err);
          return res.status(400).json({ error: "Erreur lors du téléchargement" });
        }

        const file = files.file as unknown as File;
        const filePath = Array.isArray(files.file) ? files.file[0]?.filepath : file?.filepath;

        if (!file || !filePath) {
          return res.status(400).json({ error: "Fichier manquant ou invalide" });
        }

        const fileName = path.basename(filePath);

        if (req.method === "POST") {
          const { type, name } = fields;
          if (!type || !name) {
            return res.status(400).json({ error: "Type ou nom du document manquant" });
          }

          const newDoc = await prisma.legaldocuments.create({
            data: {
              type: String(type),
              name: String(name),
              userId: user.id,
              file: fileName,
              status: "En attente",
              uploadDate: new Date(),
            },
          });

          return res.status(201).json(newDoc);
        }

        if (req.method === "PUT") {
          const { id } = fields;
          if (!id) {
            return res.status(400).json({ error: "ID du document manquant" });
          }

          const updated = await prisma.legaldocuments.update({
            where: { id: String(id) },
            data: {
              file: fileName,
              status: "En attente",
              uploadDate: new Date(),
              rejectionReason: null,
            },
          });

          return res.status(200).json(updated);
        }
      });

      return; 
    }

    return res.status(405).json({ error: "Méthode non autorisée" });
  } catch (error: any) {
    console.error("Erreur API Documents:", error);
    return res.status(500).json({ error: error.message || "Erreur serveur" });
  }
}
