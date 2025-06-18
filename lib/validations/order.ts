import { z } from "zod"

export const createOrderSchema = z.object({
  customerId: z.string().min(1, "Client requis"),
  items: z
    .array(
      z.object({
        dishId: z.string().min(1, "Plat requis"),
        quantity: z.number().positive("Quantité invalide"),
        notes: z.string().optional(),
      }),
    )
    .min(1, "Au moins un article requis"),
  deliveryAddress: z.string().optional(),
  deliveryTime: z.string().datetime().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["CASH", "CARD", "PAYPAL", "STRIPE", "BANK_TRANSFER"]).optional(),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED", "CANCELLED"]),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
