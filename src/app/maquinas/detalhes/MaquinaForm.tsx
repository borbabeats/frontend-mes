"use client";

import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Grid, CircularProgress } from "@mui/material";
import { Show } from "@refinedev/mui";
import { useOne } from "@refinedev/core";

interface MaquinaFormProps {
  id: string;
}

export default function MaquinaForm({ id }: MaquinaFormProps) {
  const { query } = useOne({
    resource: "maquinas",
    id,
    queryOptions: { enabled: !!id },
  });

  const maquina = query.data?.data;

  return (
    <Show isLoading={query.isLoading}>
      <Box
        sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}
      >
        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Código"
          value={maquina?.codigo ?? ""}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Nome"
          value={maquina?.nome ?? ""}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Descrição"
          value={maquina?.descricao ?? ""}
          multiline
          rows={3}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Fabricante"
          value={maquina?.fabricante ?? ""}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Modelo"
          value={maquina?.modelo ?? ""}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Número de Série"
          value={maquina?.numeroSerie ?? ""}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="number"
          label="Ano de Fabricação"
          value={maquina?.anoFabricacao ?? ""}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Capacidade"
          value={maquina?.capacidade ?? ""}
          InputProps={{ readOnly: true }}
        />

        <FormControl margin="normal" fullWidth>
          <InputLabel shrink>Status</InputLabel>
          <Select
            label="Status"
            value={maquina?.status ?? ""}
            inputProps={{ readOnly: true }}
          >
            <MenuItem value="DISPONIVEL">Disponível</MenuItem>
            <MenuItem value="EM_USO">Em Uso</MenuItem>
            <MenuItem value="MANUTENCAO">Manutenção</MenuItem>
            <MenuItem value="INATIVA">Inativa</MenuItem>
            <MenuItem value="PARADA">Parada</MenuItem>
            <MenuItem value="DESATIVADA">Desativada</MenuItem>
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="number"
          label="ID do Setor"
          value={maquina?.setorId ?? ""}
          InputProps={{ readOnly: true }}
        />
      </Box>
    </Show>
  );
}
