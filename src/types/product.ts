import { z } from "zod";

export const productSchema = z.object({
  id: z.number(),
  categoria: z.string(),
  precio: z.number(),
  descripcion: z.string(),
  image: z.string(),
  nombre: z.string(),
});

export type Product = z.infer<typeof productSchema>;
