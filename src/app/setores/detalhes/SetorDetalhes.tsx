"use client";

import { Box, TextField, Grid, CircularProgress } from "@mui/material";
import { useOne } from "@refinedev/core";
import { Show } from "@refinedev/mui";

interface SetorDetalhesProps {
  id: string;
}

export default function SetorDetalhes({ id }: SetorDetalhesProps) {
  const { query } = useOne({
    resource: "setores",
    id,
    queryOptions: { enabled: !!id },
  });

  const setor = query.data?.data;

  if (query.isLoading) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  return (
    <Show isLoading={query.isLoading}>
      <Box
        component="form"
        sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}
        autoComplete="off"
      >
        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="ID"
          value={setor?.id ?? ""}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Nome"
          value={setor?.nome ?? ""}
          InputProps={{ readOnly: true }}
        />


        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Criado em"
          value={setor?.created_at ? new Date(setor.created_at).toLocaleDateString("pt-BR") : ""}
          InputProps={{ readOnly: true }}
        />
      </Box>
    </Show>
  );
}
