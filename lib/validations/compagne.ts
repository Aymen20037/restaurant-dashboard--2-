import { z } from "zod"

export const compagneSchema = z.object({
  name: z.string().min(1, "Le nom de la campagne est requis."),
  type: z.string().min(1, "Le type de campagne est requis."),
  status: z.enum(["Active", "En pause", "Terminée"]), 
  budget: z.preprocess((val) => Number(val), z.number().nonnegative("Le budget ne peut pas être négatif.")),
  spent: z.preprocess((val) => Number(val ?? 0), z.number().nonnegative()),
  impressions: z.preprocess((val) => Number(val ?? 0), z.number().int().nonnegative()),
  clicks: z.preprocess((val) => Number(val ?? 0), z.number().int().nonnegative()),
  conversions: z.preprocess((val) => Number(val ?? 0), z.number().int().nonnegative()),
  startDate: z.preprocess((val) => new Date(val as string), z.date()),
  endDate: z.preprocess((val) => new Date(val as string), z.date()),
  targetAudience: z.string().optional(),
  userId: z.string().min(1, "L'ID utilisateur est requis."),
})
