import { z } from "zod"

export const promotionSchema = z.object({
  name: z.string().min(1, "Le nom est requis."),
  description: z.string().optional(),
  type: z.enum(["PERCENTAGE", "  FIXED_AMOUNT", "  FREE_DELIVERY"], {
    required_error: "Le type de promotion est requis.",
  }),
  value: z
    .string()
    .refine((val) => !isNaN(Number(val)), { message: "La valeur doit être un nombre." }),
  code: z.string().optional(),
  minAmount: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), { message: "Montant minimum invalide." }),
  maxDiscount: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), { message: "Réduction maximale invalide." }),
  usageLimit: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), { message: "Le nombre d'utilisations doit être un entier." }),
  startDate: z.string().min(1, "Date de début requise."),
  endDate: z.string().min(1, "Date de fin requise."),
  isActive: z.boolean().default(true),
})
