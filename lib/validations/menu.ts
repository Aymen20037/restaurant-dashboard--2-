import { z } from "zod"

const menuSettingsSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  showPrices: z.boolean().optional(),
  showDescriptions: z.boolean().optional(),
  showImages: z.boolean().optional(),
  colorTheme: z.string().optional(),
  layout: z.string().optional(),
  language: z.string().optional(),
})
export type MenuSettingsInput = z.infer<typeof menuSettingsSchema>