export interface Apontamento {
  id: number;
  opId?: number;
  maquinaId?: number;
  usuarioId?: number;
  quantidadeProduzida?: number;
  quantidadeDefeito?: number;
  dataInicio?: Date;
  dataFim?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateApontamentoData {
  opId?: number;
  maquinaId?: number;
  usuarioId?: number;
  quantidadeProduzida?: number;
  quantidadeDefeito?: number;
  dataInicio?: Date;
  dataFim?: Date | null;
}

export interface CreateApontamentoData {
  opId?: number;
  maquinaId?: number;
  usuarioId?: number;
  quantidadeProduzida?: number;
  quantidadeDefeito?: number;
  dataInicio?: Date;
  dataFim?: Date | null;
}
