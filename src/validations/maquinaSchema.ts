import { z } from "zod";

export const createMaquinaSchema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(20, "Nome deve ter no máximo 20 caracteres"),
  codigo: z.string()
    .min(3, "Código deve ter pelo menos 3 caracteres")
    .max(20, "Código deve ter no máximo 20 caracteres"),
  descricao: z.string()
    .min(3, "Descrição deve ter pelo menos 3 caracteres")
    .max(200, "Descrição deve ter no máximo 200 caracteres"),
  fabricante: z.string()
    .min(3, "Fabricante deve ter pelo menos 3 caracteres")
    .max(20, "Fabricante deve ter no máximo 20 caracteres"),
  modelo: z.string()
    .min(3, "Modelo deve ter pelo menos 3 caracteres")
    .max(20, "Modelo deve ter no máximo 20 caracteres"),
  numeroSerie: z.string()
    .min(3, "Número de Série deve ter pelo menos 3 caracteres")
    .max(20, "Número de Série deve ter no máximo 20 caracteres"),
  anoFabricacao: z.number()
    .min(1900, "Ano de Fabricação deve ser maior que 1900")
    .max(2100, "Ano de Fabricação deve ser menor que 2100"),
  capacidade: z.number()
    .min(0, "Capacidade deve ser maior que 0")
    .max(1000000, "Capacidade deve ser menor que 1000000"),
  
});

export const updateMaquinaSchema = createMaquinaSchema.partial({
  nome: true,
});

export type CreateMaquinaInput = z.infer<typeof createMaquinaSchema>;
export type UpdateMaquinaInput = z.infer<typeof updateMaquinaSchema>;
