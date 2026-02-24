/**
 * Utilitários para status de manutenção
 */

export type ManutencaoStatus = 'AGENDADA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA' | 'ATRASADA';

export interface Manutencao {
  id: number;
  titulo: string;
  descricao: string;
  status: ManutencaoStatus;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  dataAgendada: string;
  dataInicio?: string | null;
  dataFim?: string | null;
  maquinaId: number;
  maquina?: {
    id: number;
    nome: string;
    codigo: string;
  };
  tecnicoResponsavel?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Formata o status da manutenção para exibição
 */
export const formatarStatusManutencao = (status: string): string => {
  const statusMap: Record<string, string> = {
    'AGENDADA': 'Agendada',
    'EM_ANDAMENTO': 'Em Andamento',
    'CONCLUIDA': 'Concluída',
    'CANCELADA': 'Cancelada',
    'ATRASADA': 'Atrasada'
  };
  
  return statusMap[status] || status;
};

/**
 * Retorna a cor do chip baseada no status
 */
export const getStatusManutencaoColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  const colorMap: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    'AGENDADA': 'primary',
    'EM_ANDAMENTO': 'info',
    'CONCLUIDA': 'success',
    'CANCELADA': 'error',
    'ATRASADA': 'warning'
  };
  
  return colorMap[status] || 'default';
};

/**
 * Retorna a cor da prioridade
 */
export const getPrioridadeManutencaoColor = (prioridade: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  const colorMap: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    'BAIXA': 'success',
    'MEDIA': 'info',
    'ALTA': 'warning',
    'URGENTE': 'error'
  };
  
  return colorMap[prioridade] || 'default';
};

/**
 * Verifica se uma manutenção está atrasada
 */
export const verificarManutencaoAtrasada = (dataAgendada: string, status: string): boolean => {
  if (status === 'CONCLUIDA' || status === 'CANCELADA') {
    return false;
  }
  
  const dataAgendadaDate = new Date(dataAgendada);
  const agora = new Date();
  
  return dataAgendadaDate < agora;
};

/**
 * Calcula a duração de uma manutenção
 */
export const calcularDuracaoManutencao = (dataInicio?: string | null, dataFim?: string | null): string => {
  if (!dataInicio) return '-';
  
  try {
    const inicio = new Date(dataInicio);
    const fim = dataFim ? new Date(dataFim) : new Date();
    
    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) return '-';
    
    const diffMs = fim.getTime() - inicio.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24);
      const remainingHours = diffHours % 24;
      return `${diffDays}d ${remainingHours}h`;
    }
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}min`;
    }
    
    return `${diffMinutes}min`;
  } catch (error) {
    console.error('Erro ao calcular duração:', error);
    return '-';
  }
};

/**
 * Verifica se a manutenção pode ser cancelada
 */
export const podeCancelarManutencao = (status: string): boolean => {
  return status !== 'CONCLUIDA' && status !== 'CANCELADA';
};

/**
 * Verifica se a manutenção pode ser finalizada
 */
export const podeFinalizarManutencao = (status: string): boolean => {
  return status === 'EM_ANDAMENTO';
};

/**
 * Verifica se a manutenção pode ser iniciada
 */
export const podeIniciarManutencao = (status: string): boolean => {
  return status === 'AGENDADA';
};
