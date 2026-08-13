import { ValidacoesOP, executarValidacoes, ValidacaoResultado } from "./validacoesMES";

describe("executarValidacoes", () => {
  it("surfaces a warning result even though warnings are marked as valido: true", () => {
    const ok: ValidacaoResultado = { valido: true };
    const aviso: ValidacaoResultado = { valido: true, mensagem: "Taxa de defeito alta", tipo: "aviso" };

    const resultado = executarValidacoes([ok, aviso]);

    expect(resultado).toBe(aviso);
  });

  it("still prioritizes an error over a warning", () => {
    const aviso: ValidacaoResultado = { valido: true, mensagem: "Produção baixa", tipo: "aviso" };
    const erro: ValidacaoResultado = { valido: false, mensagem: "Campo obrigatório", tipo: "erro" };

    const resultado = executarValidacoes([aviso, erro]);

    expect(resultado).toBe(erro);
  });

  it("returns the first validation when there are no errors or warnings", () => {
    const ok: ValidacaoResultado = { valido: true };

    expect(executarValidacoes([ok])).toBe(ok);
  });
});

describe("ValidacoesOP.validarCriacaoOP", () => {
  const dadosValidos = () => {
    const inicioHoje = new Date();
    inicioHoje.setHours(0, 0, 0, 0);
    const amanha = new Date(inicioHoje);
    amanha.setDate(amanha.getDate() + 1);

    return {
      codigo: "OP-001",
      produto: "Produto X",
      quantidadePlanejada: 100,
      setorId: 1,
      dataInicioPlanejado: inicioHoje.toISOString(),
      dataFimPlanejado: amanha.toISOString(),
    };
  };

  it("does not reject a start date of today at midnight as being in the past", () => {
    const resultado = ValidacoesOP.validarCriacaoOP(dadosValidos());

    expect(resultado.valido).toBe(true);
  });

  it("still rejects a start date from yesterday", () => {
    const dados = dadosValidos();
    const ontem = new Date(dados.dataInicioPlanejado);
    ontem.setDate(ontem.getDate() - 1);

    const resultado = ValidacoesOP.validarCriacaoOP({ ...dados, dataInicioPlanejado: ontem.toISOString() });

    expect(resultado.valido).toBe(false);
    expect(resultado.mensagem).toContain("passado");
  });

  it("rejects when the required fields are missing", () => {
    const resultado = ValidacoesOP.validarCriacaoOP({});

    expect(resultado.valido).toBe(false);
  });
});
