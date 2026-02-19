import { z } from 'zod';

export const createOrdemProducaoSchema = z.object({
  codigo: z.string()
    .min(1, 'Código é obrigatório')
    .max(50, 'Código deve ter no máximo 50 caracteres'),
  
  produto: z.string()
    .min(1, 'Produto é obrigatório')
    .max(200, 'Produto deve ter no máximo 200 caracteres'),
  
  descricao: z.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
  
  quantidadePlanejada: z.number()
    .min(1, 'Quantidade planejada deve ser maior que 0')
    .max(999999, 'Quantidade planejada deve ser menor que 999999'),
  
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']),
  
  dataInicioPlanejado: z.string()
    .min(1, 'Data de início planejada é obrigatória')
    .refine((val) => {
      // Verificar se é uma data válida no formato esperado pela API: 2026-02-19T22:51
      const apiFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
      if (!apiFormatRegex.test(val)) return false;
      
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, {
      message: 'Data de início planejada deve estar no formato YYYY-MM-DDTHH:MM (ex: 2026-02-19T22:51)'
    }),
  
  dataFimPlanejado: z.string()
    .min(1, 'Data de fim planejada é obrigatória')
    .refine((val) => {
      // Verificar se é uma data válida no formato esperado pela API: 2026-02-23T22:51
      const apiFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
      if (!apiFormatRegex.test(val)) return false;
      
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, {
      message: 'Data de fim planejada deve estar no formato YYYY-MM-DDTHH:MM (ex: 2026-02-23T22:51)'
    }),
  
  setorId: z.number()
    .min(1, 'Setor é obrigatório')
    .max(999999, 'Setor inválido'),
  
  responsavelId: z.number()
    .min(1, 'Responsável deve ser um ID válido')
    .max(999999, 'Responsável inválido')
    .optional(),
  
  origemTipo: z.enum([
    'PEDIDO_VENDA', 
    'REPOSICAO_ESTOQUE', 
    'PLANO_MESTRE_PRODUCAO', 
    'DEMANDA_INTERNA', 
    'PREVISAO_VENDAS'
  ]).optional(),
  
  origemId: z.string()
    .max(50, 'ID da origem deve ter no máximo 50 caracteres')
    .optional(),
  
  observacoes: z.string()
    .max(1000, 'Observações devem ter no máximo 1000 caracteres')
    .optional()
}).refine((data) => {
  // Validação cruzada: data fim deve ser posterior à data início
  if (data.dataInicioPlanejado && data.dataFimPlanejado) {
    const dataInicio = new Date(data.dataInicioPlanejado);
    const dataFim = new Date(data.dataFimPlanejado);
    
    if (dataFim <= dataInicio) {
      return {
        success: false,
        error: {
          path: ['dataFimPlanejado'],
          message: 'Data de fim planejada deve ser posterior à data de início'
        }
      };
    }
  }
  
  return { success: true, data };
}, {
  message: 'Erro de validação do formulário',
  path: []
});

export const updateOrdemProducaoSchema = createOrdemProducaoSchema;

// Tipos para inferência
export type CreateOrdemProducaoFormData = z.infer<typeof createOrdemProducaoSchema>;
export type UpdateOrdemProducaoFormData = z.infer<typeof updateOrdemProducaoSchema>;
