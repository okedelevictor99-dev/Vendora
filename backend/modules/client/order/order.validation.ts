import { z } from "zod";
export const referenceParamSchema = z
  .object({
    reference: z
      .string()
      .min(1, "Reference is required")
      .regex(/^ORD-[A-Z0-9]+-[A-Z0-9]+$/, "Invalid order reference format"),
  })
  .strict();

export const updateOrderToRefundedSchema = z.object({
  note: z.string().max(500).optional(),
}).strict();



export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().min(1, "Page must be at least 1")),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(z.number().min(1).max(100, "Limit cannot exceed 100")),
});

export const mongoIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid order ID"),
});


export const adminOrdersQuerySchema = paginationSchema.extend({
  status: z
    .enum(["initiated", "paid", "failed", "cannot_fulfill"] as const)
    .optional(),
  refundStatus: z
    .enum(["none", "pending", "refunded", "manual_review"] as const)
    .optional(),
});