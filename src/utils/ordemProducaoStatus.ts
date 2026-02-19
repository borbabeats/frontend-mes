export type StatusOP = "RASCUNHO" | "PLANEJADA" | "EM_ANDAMENTO" | "PAUSADA" | "FINALIZADA" | "CANCELADA" | "ATRASADA";
export type UserRole = "ADMIN" | "GERENTE" | "OPERADOR" | "PLANEJAMENTO";

interface TransicaoStatus {
  de: StatusOP;
  para: StatusOP;
  rolesPermitidas: UserRole[];
  regrasEspeciais?: string[];
}

// Máquina de estados das Ordens de Produção
export const maquinaEstadosOP: TransicaoStatus[] = [
  // De RASCUNHO
  { de: "RASCUNHO", para: "PLANEJADA", rolesPermitidas: ["ADMIN", "GERENTE", "PLANEJAMENTO"] },
  { de: "RASCUNHO", para: "CANCELADA", rolesPermitidas: ["ADMIN", "GERENTE"] },
  
  // De PLANEJADA
  { de: "PLANEJADA", para: "EM_ANDAMENTO", rolesPermitidas: ["ADMIN", "GERENTE", "OPERADOR"] },
  { de: "PLANEJADA", para: "CANCELADA", rolesPermitidas: ["ADMIN", "GERENTE"] },
  
  // De EM_ANDAMENTO
  { de: "EM_ANDAMENTO", para: "PAUSADA", rolesPermitidas: ["ADMIN", "GERENTE", "OPERADOR"] },
  { de: "EM_ANDAMENTO", para: "FINALIZADA", rolesPermitidas: ["ADMIN", "GERENTE", "OPERADOR"], regrasEspeciais: ["quantidade_produzida_maior_igual_planejada"] },
  { de: "EM_ANDAMENTO", para: "CANCELADA", rolesPermitidas: ["ADMIN", "GERENTE"] },
  
  // De PAUSADA
  { de: "PAUSADA", para: "EM_ANDAMENTO", rolesPermitidas: ["ADMIN", "GERENTE", "OPERADOR"] },
  { de: "PAUSADA", para: "FINALIZADA", rolesPermitidas: ["ADMIN", "GERENTE"], regrasEspeciais: ["quantidade_produzida_maior_igual_planejada"] },
  { de: "PAUSADA", para: "CANCELADA", rolesPermitidas: ["ADMIN", "GERENTE"] },
  
  // De FINALIZADA (apenas ADMIN pode cancelar)
  { de: "FINALIZADA", para: "CANCELADA", rolesPermitidas: ["ADMIN"] },
];

// Verifica se uma transição é permitida
export const verificarTransicaoPermitida = (
  statusAtual: StatusOP,
  novoStatus: StatusOP,
  userRole: UserRole
): { permitida: boolean; motivo?: string } => {
  // ATRASADA é um estado calculado, não pode ser manualmente alterado
  if (novoStatus === "ATRASADA") {
    return { permitida: false, motivo: "Status ATRASADA é calculado automaticamente" };
  }
  
  const transicao = maquinaEstadosOP.find(
    t => t.de === statusAtual && t.para === novoStatus
  );
  
  if (!transicao) {
    return { permitida: false, motivo: `Transição de ${statusAtual} para ${novoStatus} não permitida` };
  }
  
  if (!transicao.rolesPermitidas.includes(userRole)) {
    return { 
      permitida: false, 
      motivo: `Apenas ${transicao.rolesPermitidas.join(", ")} podem realizar esta transição` 
    };
  }
  
  return { permitida: true };
};

// Obtém próximos status possíveis para um status atual e role
export const getStatusPossiveis = (statusAtual: StatusOP, userRole: UserRole): StatusOP[] => {
  return maquinaEstadosOP
    .filter(t => t.de === statusAtual && t.rolesPermitidas.includes(userRole))
    .map(t => t.para);
};

// Formatação de status para exibição
export const formatarStatusOP = (status: StatusOP): string => {
  const statusMap: Record<StatusOP, string> = {
    "RASCUNHO": "Rascunho",
    "PLANEJADA": "Planejada",
    "EM_ANDAMENTO": "Em Andamento",
    "PAUSADA": "Pausada",
    "FINALIZADA": "Finalizada",
    "CANCELADA": "Cancelada",
    "ATRASADA": "Atrasada"
  };
  
  return statusMap[status] || status;
};

// Cores para status
export const getStatusOPColor = (status: StatusOP): "success" | "warning" | "info" | "error" | "default" => {
  switch (status) {
    case "RASCUNHO": return "default";
    case "PLANEJADA": return "info";
    case "EM_ANDAMENTO": return "warning";
    case "PAUSADA": return "warning";
    case "FINALIZADA": return "success";
    case "CANCELADA": return "error";
    case "ATRASADA": return "error";
    default: return "default";
  }
};

// Verifica se OP está atrasada (status calculado automaticamente)
export const verificarOPAtrasada = (dataFimPlanejado: string, statusAtual: StatusOP): boolean => {
  if (statusAtual === "FINALIZADA" || statusAtual === "CANCELADA") {
    return false;
  }
  
  const dataFim = new Date(dataFimPlanejado);
  const agora = new Date();
  
  return agora > dataFim;
};

// Calcula progresso da OP
export const calcularProgressoOP = (quantidadeProduzida: number, quantidadePlanejada: number): number => {
  if (quantidadePlanejada === 0) return 0;
  return Math.round((quantidadeProduzida / quantidadePlanejada) * 100);
};

// Verifica se OP pode ser finalizada com base na quantidade
export const verificarPodeFinalizar = (quantidadeProduzida: number, quantidadePlanejada: number): boolean => {
  return quantidadeProduzida >= quantidadePlanejada;
};
