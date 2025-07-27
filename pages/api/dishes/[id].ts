import type { NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware/auth";
import { updateDishSchema } from "@/lib/validations/dish";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID invalide" });
  }

  switch (method) {
    case "GET":
      return getDish(req, res, id);
    case "PUT":
      return updateDish(req, res, id);
    case "DELETE":
      return deleteDish(req, res, id);
    default:
      return res.status(405).json({ error: "Méthode non autorisée" });
  }
}

async function getDish(req: AuthenticatedRequest, res: NextApiResponse, id: string) {
  try {
    const dish = await prisma.dishes.findFirst({
      where: {
        id,
        userId: req.user?.userData.id,
      },
      include: {
        categories: true,
        _count: {
          select: { order_items: true },
        },
      },
    });

    if (!dish) {
      return res.status(404).json({ error: "Plat non trouvé" });
    }

    // Convertir ingredients string en tableau
    const ingredientsArray = dish.ingredients
      ? dish.ingredients.split(",").map((i) => i.trim())
      : [];

    return res.status(200).json({ dish: { ...dish, ingredients: ingredientsArray } });
  } catch (error) {
    console.error("Erreur récupération plat:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

async function updateDish(req: AuthenticatedRequest, res: NextApiResponse, id: string) {
  try {
    const validatedData = updateDishSchema.parse(req.body);

    // Forcer la conversion ingredients en string ou null
    let ingredientsString: string | null | undefined = undefined;
    if (validatedData.ingredients !== undefined) {
      if (Array.isArray(validatedData.ingredients)) {
        ingredientsString = validatedData.ingredients.join(", ");
      } else {
        ingredientsString = validatedData.ingredients || null;
      }
    }

    // Construire l'objet de mise à jour sans le champ ingredients
    const { ingredients, ...rest } = validatedData;

    // Créer data avec ingredients converti en string ou null
    const dataToUpdate = {
      ...rest,
      ...(ingredients !== undefined && { ingredients: ingredientsString }),
    };

    const result = await prisma.dishes.updateMany({
      where: {
        id,
        userId: req.user?.userData.id,
      },
      data: dataToUpdate,
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Plat non trouvé ou non autorisé" });
    }

    const updatedDish = await prisma.dishes.findUnique({
      where: { id },
      include: { categories: true },
    });

    // Convertir ingredients string en tableau avant de renvoyer
    const ingredientsArray = updatedDish?.ingredients
      ? updatedDish.ingredients.split(",").map((i) => i.trim())
      : [];

    return res.status(200).json({
      message: "Plat mis à jour avec succès",
      dish: { ...updatedDish, ingredients: ingredientsArray },
    });
  } catch (error) {
    console.error("Erreur mise à jour plat:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Données invalides", details: error.message });
    }
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

async function deleteDish(req: AuthenticatedRequest, res: NextApiResponse, id: string) {
  try {
    const result = await prisma.dishes.deleteMany({
      where: {
        id,
        userId: req.user?.userData.id,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Plat non trouvé ou non autorisé" });
    }

    return res.status(200).json({
      message: "Plat supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur suppression plat:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

export default withAuth(handler);
