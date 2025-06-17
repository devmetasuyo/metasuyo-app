import * as z from "zod";

export const productSchema = z.object({
  id: z.number().optional(),
  categoria: z.string().min(1, "La categoria es requerida"),
  precio: z
    .number()
    .min(0, "El precio no puede ser negativo")
    .max(1000000, "El precio no puede ser mayor a 1000000"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  image: z
    .any()
    .refine((files) => files instanceof FileList, "Se espera un FileList"),
  // .refine(
  //   (files: FileList) => files.length > 0,
  //   "La imagen del producto es requerida"
  // )
  // .refine(
  //   (files: FileList) => files[0]?.type.startsWith("image/"),
  //   "El archivo debe ser una imagen"
  // )
  nombre: z.string().min(1, "El nombre es requerido"),
  cantidad: z.number().min(0, "La cantidad no puede ser negativa"),
});

export type Product = z.infer<typeof productSchema>;
