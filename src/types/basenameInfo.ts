import { z } from "zod";

export const BasenameInfoSchema = z.object({
  basename: z.string(),
  avatar: z.string().nullable(),
  description: z.string().nullable().optional(),
  x: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
});

export type BasenameInfo = z.infer<typeof BasenameInfoSchema>;
