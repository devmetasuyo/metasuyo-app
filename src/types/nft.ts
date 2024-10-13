import { z } from "zod";

export const nftSchema = z.object({
  name: z.string(),
  rarity: z.number(),
  collectionId: z.number(),
  jsonData: z.string(),
  imageUri: z.string(),
  price: z.number(),
  duplicates: z.number(),
});

export type Nft = z.infer<typeof nftSchema>;
