import { z } from "zod";

export const collectionSchema = z.object({
  name: z.string(),
  description: z.string(),
  imageUri: z.string(),
  price: z.string(),
  duplicates: z.string(),
  createdAt: z.string(),
});

export type Collection = z.infer<typeof collectionSchema>;
