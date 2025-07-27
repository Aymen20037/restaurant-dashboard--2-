import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { createDishSchema, CreateDishInput } from "@/lib/validations/dish";

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
  res: NextApiResponse
) {
  try {
    // Auth utilisateur
    const user = await getSessionUser(req, res);

    // === GET /api/dishes ===
    if (req.method === "GET") {
      const { category, search } = req.query;

      const where: any = {
        userId: user.id,
      };

      if (category && typeof category === "string" && category !== "all") {
        where.categoryId = category;
      }

      if (search && typeof search === "string") {
        where.name = {
          contains: search,
          mode: "insensitive",
        };
      }

      const dishes = await prisma.dishes.findMany({
        where,
        include: {
          categories: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Pas de split : renvoyer `ingredients` tel quel (string ou null)
      return res.status(200).json({ dishes });
    }

    // === POST /api/dishes ===
    if (req.method === "POST") {
      const parsedBody = createDishSchema.safeParse(req.body);

      if (!parsedBody.success) {
        return res.status(400).json({
          error: "Données invalides",
          details: parsedBody.error.errors,
        });
      }

      const data: CreateDishInput = parsedBody.data;

      // Normaliser ingredients en string
      let ingredientsParsed: string | null = null;
      if (data.ingredients) {
        if (typeof data.ingredients === "string") {
          const arr = data.ingredients
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          ingredientsParsed = arr.join(", ");
        } else if (Array.isArray(data.ingredients)) {
          ingredientsParsed = data.ingredients.map((s) => s.trim()).join(", ");
        }
      }

      const newDish = await prisma.dishes.create({
        data: {
          name: data.name,
          description: data.description || null,
          price: data.price,
          image: data.image || null,
          isAvailable: data.isAvailable,
          preparationTime: data.preparationTime || null,
          ingredients: ingredientsParsed, // toujours string ou null
          allergens: data.allergens || null,
          calories: data.calories || null,
          isVegetarian: data.isVegetarian,
          isVegan: data.isVegan,
          isGlutenFree: data.isGlutenFree,
          categories: { connect: { id: data.categoryId } },
          users: { connect: { id: user.id } },
        },
      });

      return res.status(201).json({ dish: newDish });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Méthode non autorisée" });
  } catch (error: any) {
    console.error("Erreur API /api/dishes :", error.message || error);
    return res.status(401).json({ error: error.message || "Non authentifié" });
  }
}
