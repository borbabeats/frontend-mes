"use client";

import { Box, TextField, Grid, CircularProgress, Chip } from "@mui/material";
import { useOne } from "@refinedev/core";
import { formatDateTime } from "@/utils/dateUtils";

interface ManutencaoDetalhesProps {
  id: string;
}

const statusColors: Record<string, "default" | "primary" | "warning" | "success" | "error"> = {
  AGENDADA: "primary",
  EM_ANDAMENTO: "warning",
  CONCLUIDA: "success",
  CANCELADA: "error",
  ATRASADA: "error",
};

const statusLabels: Record<string, string> = {
  AGENDADA: "Agendada",
  EM_ANDAMENTO: "Em Andamento",
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
  ATRASADA: "Atrasada",
};

export default function ManutencaoDetalhes({ id }: ManutencaoDetalhesProps) {
  const { query } = useOne({
    resource: "manutencoes",
    id,
    queryOptions: { enabled: !!id },
  });

  const m = query.data?.data;

  if (query.isLoading) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  return (
    <Grid container spacing={2}>
      <Box
        component="form"
        sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}
        autoComplete="off"
      >
        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Tipo"
          value={m?.tipo ?? ""}
          InputProps={{ readOnly: true }}
        />

        <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
          <Chip
            label={statusLabels[m?.status] ?? m?.status ?? ""}
            color={statusColors[m?.status] ?? "default"}
            variant="outlined"
          />
        </Box>

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Descrição"
          value={m?.descricao ?? ""}
          multiline
          rows={3}
          InputProps={{ readOnly: true }}
          sx={{ gridColumn: "1 / -1" }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Máquina"
          value={m?.maquina?.nome ?? ""}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Responsável"
          value={m?.responsavel?.nome ?? "Não atribuído"}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Data Agendada"
          value={m?.dataAgendada ? formatDateTime(m.dataAgendada) : ""}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Data Início"
          value={m?.dataInicio ? formatDateTime(m.dataInicio) : "Não iniciada"}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Data Fim"
          value={m?.dataFim ? formatDateTime(m.dataFim) : "Não concluída"}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Custo Estimado"
          value={m?.custoEstimado != null ? `R$ ${Number(m.custoEstimado).toFixed(2)}` : ""}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Custo Real"
          value={m?.custoReal != null ? `R$ ${Number(m.custoReal).toFixed(2)}` : "Não informado"}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Observações"
          value={m?.observacoes ?? ""}
          multiline
          rows={3}
          InputProps={{ readOnly: true }}
          sx={{ gridColumn: "1 / -1" }}
        />
      </Box>
    </Grid>
  );
}
