import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import path from "path";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const uploadDir = path.join(process.cwd(), "/public/uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    filename: (name, ext) => `logo_${Date.now()}${ext}`,
  });

  try {
    const [fields, files] = await form.parse(req);

    const file = (Array.isArray(files.file) ? files.file[0] : files.file) as File;

    if (!file || !file.filepath) {
      return res.status(400).json({ error: "Aucun fichier reçu." });
    }

    const fileName = path.basename(file.filepath);
    const filePath = `/uploads/${fileName}`;

    return res.status(200).json({ url: filePath });
  } catch (error: any) {
    console.error("Erreur upload:", error);
    return res.status(500).json({ error: "Erreur lors de l'upload du fichier." });
  }
}
