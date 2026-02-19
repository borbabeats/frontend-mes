import { StatusOP, verificarTransicaoPermitida, verificarPodeFinalizar } from './ordemProducaoStatus';

// Validações baseadas nas regras de negócio do sistema MES

export interface ValidacaoResultado {
  valido: boolean;
  mensagem?: string;
  tipo?: 'erro' | 'aviso' | 'info';
}

// Validações para Ordens de Produção
export const ValidacoesOP = {
  // Validação de criação de OP
  validarCriacaoOP: (dados: any): ValidacaoResultado => {
    if (!dados.codigo || dados.codigo.trim() === '') {
      return { valido: false, mensagem: 'Código da OP é obrigatório', tipo: 'erro' };
    }

    if (!dados.produto || dados.produto.trim() === '') {
      return { valido: false, mensagem: 'Produto é obrigatório', tipo: 'erro' };
    }

    if (!dados.quantidadePlanejada || dados.quantidadePlanejada <= 0) {
      return { valido: false, mensagem: 'Quantidade planejada deve ser maior que zero', tipo: 'erro' };
    }

    if (!dados.setorId || dados.setorId <= 0) {
      return { valido: false, mensagem: 'Setor é obrigatório', tipo: 'erro' };
    }

    if (!dados.dataInicioPlanejado || !dados.dataFimPlanejado) {
      return { valido: false, mensagem: 'Datas planejadas são obrigatórias', tipo: 'erro' };
    }

    const dataInicio = new Date(dados.dataInicioPlanejado);
    const dataFim = new Date(dados.dataFimPlanejado);

    if (dataFim <= dataInicio) {
      return { valido: false, mensagem: 'Data fim planejada deve ser posterior à data início', tipo: 'erro' };
    }

    if (dataInicio < new Date()) {
      return { valido: false, mensagem: 'Data início planejada não pode ser no passado', tipo: 'erro' };
    }

    return { valido: true };
  },

  // Validação de alteração de status
  validarAlteracaoStatus: (
    statusAtual: StatusOP, 
    novoStatus: StatusOP, 
    userRole: string,
    quantidadeProduzida: number,
    quantidadePlanejada: number
  ): ValidacaoResultado => {
    const verificacao = verificarTransicaoPermitida(statusAtual, novoStatus, userRole as any);
    
    if (!verificacao.permitida) {
      return { 
        valido: false, 
        mensagem: verificacao.motivo || 'Transição não permitida', 
        tipo: 'erro' 
      };
    }

    // Regra especial para FINALIZADA
    if (novoStatus === 'FINALIZADA') {
      if (!verificarPodeFinalizar(quantidadeProduzida, quantidadePlanejada)) {
        return { 
          valido: false, 
          mensagem: `Não é possível finalizar: quantidade produzida (${quantidadeProduzida}) é menor que a planejada (${quantidadePlanejada})`, 
          tipo: 'erro' 
        };
      }
    }

    return { valido: true };
  },

  // Validação de atualização de produção
  validarAtualizacaoProducao: (quantidade: number, defeitos: number): ValidacaoResultado => {
    if (isNaN(quantidade) || quantidade < 0) {
      return { valido: false, mensagem: 'Quantidade produzida deve ser um número válido e não negativo', tipo: 'erro' };
    }

    if (isNaN(defeitos) || defeitos < 0) {
      return { valido: false, mensagem: 'Quantidade de defeitos deve ser um número válido e não negativo', tipo: 'erro' };
    }

    if (defeitos > quantidade) {
      return { valido: false, mensagem: 'Quantidade de defeitos não pode ser maior que a quantidade produzida', tipo: 'erro' };
    }

    // Aviso se taxa de defeito for muito alta
    if (quantidade > 0 && (defeitos / quantidade) > 0.1) {
      return { 
        valido: true, 
        mensagem: 'Taxa de defeito acima de 10%. Verifique a qualidade da produção.', 
        tipo: 'aviso' 
      };
    }

    return { valido: true };
  }
};

// Validações para Apontamentos
export const ValidacoesApontamento = {
  // Validação de criação de apontamento
  validarCriacaoApontamento: (dados: any): ValidacaoResultado => {
    if (!dados.opId || dados.opId <= 0) {
      return { valido: false, mensagem: 'Ordem de produção é obrigatória', tipo: 'erro' };
    }

    if (!dados.maquinaId || dados.maquinaId <= 0) {
      return { valido: false, mensagem: 'Máquina é obrigatória', tipo: 'erro' };
    }

    if (!dados.usuarioId || dados.usuarioId <= 0) {
      return { valido: false, mensagem: 'Operador é obrigatório', tipo: 'erro' };
    }

    if (!dados.dataInicio) {
      return { valido: false, mensagem: 'Data de início é obrigatória', tipo: 'erro' };
    }

    if (dados.dataFim && new Date(dados.dataFim) <= new Date(dados.dataInicio)) {
      return { valido: false, mensagem: 'Data fim deve ser posterior à data início', tipo: 'erro' };
    }

    // Validação de quantidades
    const validacaoQuantidade = ValidacoesOP.validarAtualizacaoProducao(
      dados.quantidadeProduzida || 0,
      dados.quantidadeDefeito || 0
    );

    if (!validacaoQuantidade.valido) {
      return validacaoQuantidade;
    }

    return { valido: true };
  },

  // Validação de finalização de apontamento
  validarFinalizacaoApontamento: (quantidadeProduzida: number, quantidadeDefeito: number): ValidacaoResultado => {
    if (quantidadeProduzida <= 0) {
      return { valido: false, mensagem: 'Quantidade produzida deve ser maior que zero para finalizar', tipo: 'erro' };
    }

    const validacaoQuantidade = ValidacoesOP.validarAtualizacaoProducao(quantidadeProduzida, quantidadeDefeito);
    
    if (!validacaoQuantidade.valido) {
      return validacaoQuantidade;
    }

    // Aviso se não houver produção significativa
    if (quantidadeProduzida < 10) {
      return { 
        valido: true, 
        mensagem: 'Produção muito baixa. Verifique se os dados estão corretos.', 
        tipo: 'aviso' 
      };
    }

    return { valido: true };
  }
};

// Validações de negócio gerais
export const ValidacoesGerais = {
  // Validação de datas
  validarDataFutura: (data: string): ValidacaoResultado => {
    const dataInformada = new Date(data);
    const agora = new Date();

    if (dataInformada < agora) {
      return { valido: false, mensagem: 'Data não pode ser no passado', tipo: 'erro' };
    }

    return { valido: true };
  },

  // Validação de período
  validarPeriodo: (dataInicio: string, dataFim: string): ValidacaoResultado => {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    if (fim <= inicio) {
      return { valido: false, mensagem: 'Data fim deve ser posterior à data início', tipo: 'erro' };
    }

    // Verificar se o período é muito longo (mais de 30 dias)
    const diffDias = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDias > 30) {
      return { 
        valido: true, 
        mensagem: 'Período de produção muito longo. Considere dividir em múltiplas OPs.', 
        tipo: 'aviso' 
      };
    }

    return { valido: true };
  },

  // Validação de capacidade
  validarCapacidadeProducao: (quantidade: number, diasProducao: number): ValidacaoResultado => {
    if (diasProducao <= 0) {
      return { valido: false, mensagem: 'Período de produção deve ser maior que zero', tipo: 'erro' };
    }

    const mediaDiaria = quantidade / diasProducao;

    // Aviso se a média diária for muito alta (mais de 1000 unidades por dia)
    if (mediaDiaria > 1000) {
      return { 
        valido: true, 
        mensagem: `Média diária de ${mediaDiaria.toFixed(0)} unidades. Verifique a capacidade de produção.`, 
        tipo: 'aviso' 
      };
    }

    // Erro se a média diária for muito baixa (menos de 10 unidades por dia)
    if (mediaDiaria < 10 && quantidade > 0) {
      return { 
        valido: false, 
        mensagem: `Média diária muito baixa (${mediaDiaria.toFixed(1)} unidades). Verifique o planejamento.`, 
        tipo: 'erro' 
      };
    }

    return { valido: true };
  }
};

// Função utilitária para executar múltiplas validações
export const executarValidacoes = (validacoes: ValidacaoResultado[]): ValidacaoResultado => {
  // Encontrar primeiro erro
  const erro = validacoes.find(v => !v.valido && v.tipo === 'erro');
  if (erro) return erro;

  // Encontrar primeiro aviso
  const aviso = validacoes.find(v => !v.valido && v.tipo === 'aviso');
  if (aviso) return aviso;

  // Retornar primeira validação se todas forem válidas
  return validacoes[0] || { valido: true };
};

// Exportar todas as validações para uso fácil
export const ValidacoesMES = {
  op: ValidacoesOP,
  apontamento: ValidacoesApontamento,
  gerais: ValidacoesGerais,
  executar: executarValidacoes
};
