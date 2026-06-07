"use client";

import { Box, TextField, Grid, CircularProgress, Chip } from '@mui/material';
import { useOne } from '@refinedev/core';
import { Show } from '@refinedev/mui';

interface UsuarioDetalhesProps {
  id: string;
}

const cargoLabel: Record<string, string> = {
  ADMIN: 'Administrador',
  GERENTE: 'Gerente',
  OPERADOR: 'Operador',
};

const cargoColor: Record<string, 'error' | 'warning' | 'info' | 'default'> = {
  ADMIN: 'error',
  GERENTE: 'warning',
  OPERADOR: 'info',
};

export default function UsuarioDetalhes({ id }: UsuarioDetalhesProps) {
  const { query } = useOne({
    resource: 'usuarios',
    id,
    queryOptions: { enabled: !!id },
  });

  const usuario = query.data?.data;

  if (query.isLoading) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  return (
    <Show isLoading={query.isLoading}>
      <Box
        component="form"
        sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}
        autoComplete="off"
      >
        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Nome"
          value={usuario?.nome ?? ''}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Email"
          value={usuario?.email ?? ''}
          InputProps={{ readOnly: true }}
        />

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Setor"
          value={usuario?.nomeSetor ?? ''}
          InputProps={{ readOnly: true }}
        />

        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={cargoLabel[usuario?.cargo] ?? usuario?.cargo ?? ''}
            color={cargoColor[usuario?.cargo] ?? 'default'}
            variant="outlined"
          />
        </Box>

        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Criado em"
          value={usuario?.createdAt ? new Date(usuario.createdAt).toLocaleDateString('pt-BR') : ''}
          InputProps={{ readOnly: true }}
        />
      </Box>
    </Show>
  );
}
