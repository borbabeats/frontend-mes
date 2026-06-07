"use client";

import { Box, TextField, Chip } from "@mui/material";
import { Show } from "@refinedev/mui";
import { useOne } from "@refinedev/core";
import { formatDateTime, calculateDuration } from "@/utils/dateUtils";

interface ApontamentoDetalhesProps {
  id: string;
}

export default function ApontamentoDetalhes({ id }: ApontamentoDetalhesProps) {
  const { query } = useOne({
    resource: "apontamentos",
    id,
    queryOptions: { enabled: !!id },
  });

  const a = query.data?.data;

  const { query: opQuery } = useOne({
    resource: "ordens-producao",
    id: a?.opId,
    queryOptions: { enabled: !!a?.opId && !a?.op },
  });

  const { query: maquinaQuery } = useOne({
    resource: "maquinas",
    id: a?.maquinaId,
    queryOptions: { enabled: !!a?.maquinaId && !a?.maquina },
  });

  const { query: usuarioQuery } = useOne({
    resource: "usuarios",
    id: a?.usuarioId,
    queryOptions: { enabled: !!a?.usuarioId && !a?.usuario },
  });

  const op = a?.op ?? opQuery.data?.data;
  const maquina = a?.maquina ?? maquinaQuery.data?.data;
  const usuario = a?.usuario ?? usuarioQuery.data?.data;

  return (
    <Show isLoading={query.isLoading}>
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}>
        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Ordem de Produção"
          value={op?.codigo ?? a?.opId ?? ""}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Produto"
          value={op?.produto ?? "Não informado"}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Máquina"
          value={maquina?.nome ?? a?.maquinaId ?? ""}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Operador"
          value={usuario?.nome ?? a?.usuarioId ?? ""}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Data Início"
          value={a?.dataInicio ? formatDateTime(a.dataInicio) : ""}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Data Fim"
          value={a?.dataFim ? formatDateTime(a.dataFim) : "Em andamento"}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Duração"
          value={a ? calculateDuration(a.dataInicio, a.dataFim) : ""}
          InputProps={{ readOnly: true }}
        />

        <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
          <Chip
            label={a?.dataFim ? "Concluído" : "Em Andamento"}
            color={a?.dataFim ? "success" : "warning"}
            variant="outlined"
          />
        </Box>

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Quantidade Produzida"
          value={a?.quantidadeProduzida ?? ""}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Quantidade com Defeito"
          value={a?.quantidadeDefeito ?? ""}
          InputProps={{ readOnly: true }}
        />

        {a && a.quantidadeProduzida > 0 && (
          <TextField
            margin="normal"
            InputLabelProps={{ shrink: true }}
            label="Índice de Qualidade"
            value={`${Math.round(((a.quantidadeProduzida - a.quantidadeDefeito) / a.quantidadeProduzida) * 100)}%`}
            InputProps={{ readOnly: true }}
          />
        )}

        {a?.observacoes && (
          <TextField
            margin="normal"
            InputLabelProps={{ shrink: true }}
            label="Observações"
            value={a.observacoes}
            multiline
            rows={3}
            InputProps={{ readOnly: true }}
            sx={{ gridColumn: "1 / -1" }}
          />
        )}
      </Box>
    </Show>
  );
}
