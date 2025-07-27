import { z } from "zod"

export const createDishSchema = z.object({
  name: z.string().min(2, "Le nom du plat est requis"),
  description: z.string().optional(),
  price: z.number().positive("Le prix doit être positif"),
  categoryId: z.string().min(1, "La catégorie est requise"),
  image: z.string().url().optional(),
  preparationTime: z.number().positive().optional(),
  ingredients: z.union([
    z.string(),
    z.array(z.string()),
  ]).optional(), 
  allergens: z.string().optional(),
  calories: z.number().positive().optional(),
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
})

export const updateDishSchema = createDishSchema.partial()

export type CreateDishInput = z.infer<typeof createDishSchema>
export type UpdateDishInput = z.infer<typeof updateDishSchema>
