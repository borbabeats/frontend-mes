import { api } from './mesService';

// Interfaces para os dados do Dashboard
export interface KPIProducao {
  opsAtivas: number;
  producaoDia: number;
  eficienciaGlobal: number;
  taxaDefeitos: number;
}

export interface KPIQualidade {
  indiceQualidade: number;
  rejeicoesMes: number;
  conformidade: number;
}

export interface KPIRecursos {
  maquinasAtivas: number;
  taxaOEE: number;
  disponibilidade: number;
}

export interface KPIPrazos {
  opsAtraso: number;
  cumprimentoPrazos: number;
  tempoMedioCiclo: number;
}

export interface ProducaoDiaria {
  data: string;
  planejado: number;
  realizado: number;
}

export interface ProducaoPorSetor {
  setor: string;
  quantidade: number;
  eficiencia: number;
}

export interface StatusOP {
  status: string;
  quantidade: number;
  percentual: number;
}

export interface TendenciaQualidade {
  data: string;
  taxaDefeitos: number;
  meta: number;
}

export interface OEETempoReal {
  valor: number;
  status: 'critico' | 'regular' | 'otimo';
  disponibilidade: number;
  performance: number;
  qualidade: number;
}

export interface TopProduto {
  produto: string;
  quantidade: number;
  qualidade: number;
}

export interface ProducaoPorTurno {
  turno: string;
  dia: string;
  quantidade: number;
}

export interface AlertaCritico {
  id: number;
  tipo: 'maquina' | 'op' | 'qualidade';
  mensagem: string;
  gravidade: 'alta' | 'media' | 'baixa';
  data: string;
}

export interface MetaDia {
  id: number;
  descricao: string;
  atual: number;
  meta: number;
  percentual: number;
  status: 'concluida' | 'andamento' | 'atrasada';
}

export interface EficienciaOperador {
  id: number;
  nome: string;
  eficiencia: number;
  producao: number;
  qualidade: number;
}

export const DashboardService = {
  // KPIs
  async getKPIProducao(): Promise<KPIProducao> {
    const response = await api.get('/dashboard/kpis/producao');
    return response.data;
  },

  async getKPIQualidade(): Promise<KPIQualidade> {
    const response = await api.get('/dashboard/kpis/qualidade');
    return response.data;
  },

  async getKPIRecursos(): Promise<KPIRecursos> {
    const response = await api.get('/dashboard/kpis/recursos');
    return response.data;
  },

  async getKPIPrazos(): Promise<KPIPrazos> {
    const response = await api.get('/dashboard/kpis/prazos');
    return response.data;
  },

  // Gráficos
  async getProducaoDiaria(dias: number = 30): Promise<ProducaoDiaria[]> {
    const response = await api.get('/dashboard/graficos/producao-diaria', {
      params: { dias }
    });
    return response.data;
  },

  async getProducaoPorSetor(periodo: string = 'mes'): Promise<ProducaoPorSetor[]> {
    const response = await api.get('/dashboard/graficos/producao-por-setor', {
      params: { periodo }
    });
    return response.data;
  },

  async getStatusOPs(): Promise<StatusOP[]> {
    const response = await api.get('/dashboard/graficos/status-ops');
    return response.data;
  },

  async getTendenciaQualidade(dias: number = 30): Promise<TendenciaQualidade[]> {
    const response = await api.get('/dashboard/graficos/tendencia-qualidade', {
      params: { dias }
    });
    return response.data;
  },

  async getOEETempoReal(): Promise<OEETempoReal> {
    const response = await api.get('/dashboard/graficos/oee-tempo-real');
    return response.data;
  },

  async getTopProdutos(periodo: string = 'mes'): Promise<TopProduto[]> {
    const response = await api.get('/dashboard/graficos/top-produtos', {
      params: { periodo }
    });
    return response.data;
  },

  async getProducaoPorTurno(dias: number = 7): Promise<ProducaoPorTurno[]> {
    const response = await api.get('/dashboard/graficos/producao-por-turno', {
      params: { dias }
    });
    return response.data;
  },

  // Cards de Status em Tempo Real
  async getAlertasCriticos(): Promise<AlertaCritico[]> {
    const response = await api.get('/dashboard/alertas/criticos');
    return response.data;
  },

  async getMetasDia(): Promise<MetaDia[]> {
    const response = await api.get('/dashboard/metas/dia');
    return response.data;
  },

  async getEficienciaOperadores(periodo: string = 'semana'): Promise<EficienciaOperador[]> {
    const response = await api.get('/dashboard/eficiencia/operadores', {
      params: { periodo }
    });
    return response.data;
  }
};

export default DashboardService;
