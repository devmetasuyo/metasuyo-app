import { z } from "zod";

export const invoiceSchema = z.object({
  id: z.number(),
  cliente_id: z.number().optional(),
  total: z.number(),
  hash: z.string(),
  estado: z.string(),
});

export type Invoice = z.infer<typeof invoiceSchema>;
