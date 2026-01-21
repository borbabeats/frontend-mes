import { z } from "zod";

export const createUserSchema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras"),
  
  email: z.string()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  
  senha: z.string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(50, "Senha deve ter no máximo 50 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número"),
  
  cargo: z.string()
    .min(2, "Cargo deve ter pelo menos 2 caracteres")
    .max(50, "Cargo deve ter no máximo 50 caracteres"),
  
  setor_id: z.number({
    required_error: "ID do Setor é obrigatório",
    invalid_type_error: "ID do Setor deve ser um número"
  })
    .int("ID do Setor deve ser um número inteiro")
    .positive("ID do Setor deve ser um número positivo")
});

export const updateUserSchema = createUserSchema.omit({ senha: true }).partial({
  nome: true,
  email: true,
  cargo: true,
  setor_id: true
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
