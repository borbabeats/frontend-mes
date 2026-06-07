"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/providers/socket";

export function useSocketInvalidation() {
  const { on, off } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOpAlterado = () => {
      queryClient.invalidateQueries({ queryKey: ["ordens-producao"] });
    };

    const handleMaquinaAlterada = () => {
      queryClient.invalidateQueries({ queryKey: ["maquinas"] });
    };

    const handleManutencaoAlterada = () => {
      queryClient.invalidateQueries({ queryKey: ["manutencoes"] });
    };

    on("op:status_alterado", handleOpAlterado);
    on("maquina:status_alterado", handleMaquinaAlterada);
    on("manutencao:status_alterado", handleManutencaoAlterada);

    return () => {
      off("op:status_alterado", handleOpAlterado);
      off("maquina:status_alterado", handleMaquinaAlterada);
      off("manutencao:status_alterado", handleManutencaoAlterada);
    };
  }, [on, off, queryClient]);
}
