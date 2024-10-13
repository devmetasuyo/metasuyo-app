import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1, "El nombre de la colección es requerido"),
  description: z.string().min(1, "La descripción de la colección es requerida"),
  image: z
    .any()
    .refine((files) => files instanceof FileList, "Se espera un FileList")
    .refine(
      (files: FileList) => files.length > 0,
      "La imagen de la colección es requerida"
    )
    .refine(
      (files: FileList) => files[0]?.type.startsWith("image/"),
      "El archivo debe ser una imagen"
    ),
});

export const nftSchema = z.object({
  uId: z.string().min(1, "El UID es requerido"),
  title: z.string().min(1, "El título es requerido"),
  rarity: z.number().min(1).max(5, "La rareza debe estar entre 1 y 5"),
  category: z.number().min(0, "Debe seleccionar una colección"),
  description: z.string().min(1, "La descripción es requerida"),
  count: z.number().min(1).max(1000, "La cantidad debe estar entre 1 y 1000"),
  price: z.number().min(0, "El precio no puede ser negativo"),
  image: z
    .any()
    .refine((files) => files instanceof FileList, "Se espera un FileList")
    .refine(
      (files: FileList) => files.length > 0,
      "La imagen de la colección es requerida"
    )
    .refine(
      (files: FileList) => files[0]?.type.startsWith("image/"),
      "El archivo debe ser una imagen"
    ),
});

export type NftFormData = z.infer<typeof nftSchema>;

export type FormData = z.infer<typeof schema>;
