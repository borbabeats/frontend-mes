import {
  verificarTransicaoPermitida,
  getStatusPossiveis,
  verificarOPAtrasada,
  calcularProgressoOP,
  verificarPodeFinalizar,
  isUserRole,
  isStatusOP,
} from "./ordemProducaoStatus";

describe("verificarTransicaoPermitida", () => {
  it("allows PLANEJAMENTO to move an order from RASCUNHO to PLANEJADA", () => {
    const resultado = verificarTransicaoPermitida("RASCUNHO", "PLANEJADA", "PLANEJAMENTO");

    expect(resultado.permitida).toBe(true);
  });

  it("rejects OPERADOR moving an order from RASCUNHO to PLANEJADA", () => {
    const resultado = verificarTransicaoPermitida("RASCUNHO", "PLANEJADA", "OPERADOR");

    expect(resultado.permitida).toBe(false);
    expect(resultado.motivo).toContain("ADMIN, GERENTE, PLANEJAMENTO");
  });

  it("rejects any manual transition to ATRASADA, since it is a computed status", () => {
    const resultado = verificarTransicaoPermitida("EM_ANDAMENTO", "ATRASADA", "ADMIN");

    expect(resultado.permitida).toBe(false);
    expect(resultado.motivo).toBe("Status ATRASADA é calculado automaticamente");
  });

  it("rejects transitions that are not defined in the state machine", () => {
    const resultado = verificarTransicaoPermitida("RASCUNHO", "FINALIZADA", "ADMIN");

    expect(resultado.permitida).toBe(false);
    expect(resultado.motivo).toBe("Transição de RASCUNHO para FINALIZADA não permitida");
  });

  it("only ADMIN can cancel a FINALIZADA order", () => {
    expect(verificarTransicaoPermitida("FINALIZADA", "CANCELADA", "ADMIN").permitida).toBe(true);
    expect(verificarTransicaoPermitida("FINALIZADA", "CANCELADA", "GERENTE").permitida).toBe(false);
  });
});

describe("getStatusPossiveis", () => {
  it("returns every next status an OPERADOR can move an EM_ANDAMENTO order to", () => {
    const proximos = getStatusPossiveis("EM_ANDAMENTO", "OPERADOR");

    expect(proximos).toEqual(expect.arrayContaining(["PAUSADA", "FINALIZADA"]));
    expect(proximos).not.toContain("CANCELADA");
  });

  it("returns an empty list when the role has no permitted transitions", () => {
    const proximos = getStatusPossiveis("FINALIZADA", "OPERADOR");

    expect(proximos).toEqual([]);
  });
});

describe("verificarOPAtrasada", () => {
  it("marks an EM_ANDAMENTO order as overdue when the planned end date has passed", () => {
    const dataPassada = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    expect(verificarOPAtrasada(dataPassada, "EM_ANDAMENTO")).toBe(true);
  });

  it("does not mark a FINALIZADA order as overdue, even if the planned end date has passed", () => {
    const dataPassada = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    expect(verificarOPAtrasada(dataPassada, "FINALIZADA")).toBe(false);
  });
});

describe("calcularProgressoOP", () => {
  it("computes progress as a rounded percentage of produced over planned quantity", () => {
    expect(calcularProgressoOP(50, 200)).toBe(25);
  });

  it("returns 0 instead of dividing by zero when nothing was planned", () => {
    expect(calcularProgressoOP(10, 0)).toBe(0);
  });
});

describe("verificarPodeFinalizar", () => {
  it("allows finalizing once produced quantity reaches the planned quantity", () => {
    expect(verificarPodeFinalizar(100, 100)).toBe(true);
    expect(verificarPodeFinalizar(120, 100)).toBe(true);
  });

  it("blocks finalizing while produced quantity is below the planned quantity", () => {
    expect(verificarPodeFinalizar(99, 100)).toBe(false);
  });
});

describe("isUserRole", () => {
  it("accepts every known role", () => {
    expect(isUserRole("ADMIN")).toBe(true);
    expect(isUserRole("GERENTE")).toBe(true);
    expect(isUserRole("OPERADOR")).toBe(true);
    expect(isUserRole("PLANEJAMENTO")).toBe(true);
  });

  it("rejects unknown role strings instead of silently accepting them", () => {
    expect(isUserRole("SUPERVISOR")).toBe(false);
    expect(isUserRole("admin")).toBe(false);
  });

  it("rejects non-string and empty values", () => {
    expect(isUserRole(undefined)).toBe(false);
    expect(isUserRole(null)).toBe(false);
    expect(isUserRole("")).toBe(false);
  });
});

describe("isStatusOP", () => {
  it("accepts every known status", () => {
    expect(isStatusOP("RASCUNHO")).toBe(true);
    expect(isStatusOP("ATRASADA")).toBe(true);
  });

  it("rejects unknown status strings instead of silently accepting them", () => {
    expect(isStatusOP("EM_PROGRESSO")).toBe(false);
  });

  it("rejects non-string and empty values", () => {
    expect(isStatusOP(undefined)).toBe(false);
    expect(isStatusOP(null)).toBe(false);
  });
});
