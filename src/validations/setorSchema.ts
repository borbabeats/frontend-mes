import { z } from "zod";

export const createSetorSchema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(20, "Nome deve ter no máximo 20 caracteres"),
  
});

export const updateSetorSchema = createSetorSchema.partial({
  nome: true,
});

export type CreateSetorInput = z.infer<typeof createSetorSchema>;
export type UpdateSetorInput = z.infer<typeof updateSetorSchema>;
