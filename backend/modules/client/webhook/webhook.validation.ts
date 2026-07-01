import z from "zod";



export const paystackWebhookSchema = z.object({
  event: z.string(),
  data: z.object({
    reference: z.string(),
  }),
}).strict();