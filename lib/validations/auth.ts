import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})

export const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  name: z.string().min(2, "Le nom est requis"),
  phone: z.string().optional(),
  restaurantName: z.string().min(2, "Le nom du restaurant est requis"),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  deliveryRadius: z.string().optional(),
  hours: z.string().optional(),
  isOpen: z.boolean().optional(),
  minimumOrder: z
  .string()
  .refine((val) => !val || !isNaN(parseFloat(val)), {
    message: "Le montant minimum doit être un nombre",
  })
  .transform((val) => (val ? parseFloat(val) : undefined))
  .optional(),

  customMessage: z.string().optional(),

  cuisineIds: z
    .array(z.string().min(1, "ID de cuisine requis"))
    .min(1, "Veuillez sélectionner au moins une cuisine"),

  notifications: z.record(z.any()).optional(),
  security: z.record(z.any()).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
