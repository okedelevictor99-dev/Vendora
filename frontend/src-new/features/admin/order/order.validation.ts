import { z } from "zod";

export const refundOrderSchema = z.object({
  note: z
    .string()
    .max(500, "Refund note cannot exceed 500 characters")
    .optional(),
});

export type RefundOrderFormValues = z.infer<typeof refundOrderSchema>;