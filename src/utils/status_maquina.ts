type StatusMaquina = "DISPONIVEL" | "EM_USO" | "MANUTENCAO" | "INATIVA" | "PARADA" | "DESATIVADA";

export default function statusMaquina(status: StatusMaquina): string {
  
  const statusMap: Record<StatusMaquina, string> = {
    DISPONIVEL: "Disponível",
    EM_USO: "Em Uso",
    MANUTENCAO: "Manutenção",
    INATIVA: "Inativa",
    PARADA: "Parada",
    DESATIVADA: "Desativada"
  };
  
  return statusMap[status] || status;
}

// Funções para cores de status e prioridade
export const getStatusColor = (status: string): "success" | "warning" | "info" | "error" | "default" => {
  switch (status) {
    case 'EM_ANDAMENTO': return 'warning';
    case 'FINALIZADA': return 'success';
    case 'PENDENTE': return 'info';
    case 'CANCELADA': return 'error';
    case 'DISPONIVEL': return 'success';
    case 'EM_USO': return 'warning';
    case 'MANUTENCAO': return 'error';
    case 'INATIVA': return 'default';
    case 'PARADA': return 'error';
    case 'DESATIVADA': return 'default';
    default: return 'default';
  }
};

export const getPrioridadeColor = (prioridade: string): "success" | "warning" | "info" | "error" | "default" => {
  switch (prioridade) {
    case 'URGENTE': return 'error';
    case 'ALTA': return 'warning';
    case 'NORMAL': return 'info';
    case 'BAIXA': return 'default';
    default: return 'default';
  }
};