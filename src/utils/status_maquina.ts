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