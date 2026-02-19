'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid2,
  Chip,
  LinearProgress,
  Avatar,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Factory,
  Person,
  Schedule,
  ProductionQuantityLimits,
  ErrorOutline,
  Visibility
} from '@mui/icons-material';
import { useList, useOne } from '@refinedev/core';
import { formatDateTime } from '@utils/dateUtils';
import { useRouter } from 'next/navigation';
import FinalizeApontamentoButton from './FinalizeApontamentoButton';

interface Apontamento {
  id: number;
  opId: number;
  maquinaId: number;
  usuarioId: number;
  quantidadeProduzida: number;
  quantidadeDefeito: number;
  dataInicio: string;
  dataFim: string | null;
  createdAt: string;
  updatedAt: string;
  ordemProducao?: {
    codigo: string;
    produto: string;
  };
  maquina?: {
    nome: string;
    setor?: {
      nome: string;
    };
  };
  usuario?: {
    nome: string;
  };
}

interface ApontamentosListProps {
  tipo: 'ordem-producao' | 'maquina' | 'usuario' | 'todos';
  id?: number | string;
}

export default function ApontamentosList({ tipo, id }: ApontamentosListProps) {
  const router = useRouter();

  // Construir filtros baseado no tipo
  const filters = [];
  if (tipo === 'ordem-producao' && id) {
    filters.push({
      field: 'opId',
      operator: 'eq' as const,
      value: Number(id)
    });
  } else if (tipo === 'maquina' && id) {
    filters.push({
      field: 'maquinaId',
      operator: 'eq' as const,
      value: Number(id)
    });
  } else if (tipo === 'usuario' && id) {
    filters.push({
      field: 'usuarioId',
      operator: 'eq' as const,
      value: Number(id)
    });
  }

  const { result, query } = useList({
    resource: 'apontamentos',
    filters,
    sorters: [
      {
        field: 'createdAt',
        order: 'desc'
      }
    ],
    pagination: {
      mode: 'off'
    }
  });

  // Carregar dados relacionados se tivermos apontamentos
  const apontamentos = result?.data || [];
  const apontamentosLoading = query?.isLoading || false;

  const calcularTaxaDefeito = (produzida: number, defeitos: number) => {
    if (produzida === 0) return 0;
    return ((defeitos / produzida) * 100).toFixed(2);
  };

  const calcularDuracao = (dataInicio: string, dataFim: string | null) => {
    if (!dataFim) return 'Em andamento';
    
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diffMs = fim.getTime() - inicio.getTime();
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHoras}h ${diffMinutos}min`;
  };

  const getStatusColor = (dataFim: string | null) => {
    if (!dataFim) return 'warning';
    return 'success';
  };

  const getStatusText = (dataFim: string | null) => {
    if (!dataFim) return 'Em Andamento';
    return 'Finalizado';
  };

  if (apontamentosLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!apontamentos || apontamentos.length === 0) {
    return (
      <Alert severity="info">
        Nenhum apontamento encontrado{tipo !== 'todos' ? ` para este ${tipo}` : ''}.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Apontamentos {tipo !== 'todos' && `(${tipo}: ${id})`}
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ordem de Produção</TableCell>
              <TableCell>Máquina</TableCell>
              <TableCell>Operador</TableCell>
              <TableCell>Produção</TableCell>
              <TableCell>Duração</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apontamentos.map((apontamento: any, index: number) => (
              <TableRow key={apontamento.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    #{apontamento.id}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                      <Factory sx={{ fontSize: 14 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {apontamento.ordemProducao?.codigo || `OP-${apontamento.opId}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {apontamento.ordemProducao?.produto || 'Carregando...'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main' }}>
                      <Factory sx={{ fontSize: 14 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {apontamento.maquina?.nome || `Máquina ${apontamento.maquinaId}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {apontamento.maquina?.setor?.nome || 'Setor não informado'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'info.main' }}>
                      <Person sx={{ fontSize: 14 }} />
                    </Avatar>
                    <Typography variant="body2">
                      {apontamento.usuario?.nome || `Usuário ${apontamento.usuarioId}`}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <ProductionQuantityLimits sx={{ fontSize: 16, color: 'success.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {apontamento.quantidadeProduzida}
                      </Typography>
                    </Box>
                    {apontamento.quantidadeDefeito > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ErrorOutline sx={{ fontSize: 14, color: 'error.main' }} />
                        <Typography variant="caption" color="error">
                          {apontamento.quantidadeDefeito} ({calcularTaxaDefeito(apontamento.quantidadeProduzida, apontamento.quantidadeDefeito)}%)
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>

                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {calcularDuracao(apontamento.dataInicio, apontamento.dataFim)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(apontamento.dataInicio)}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip 
                    label={getStatusText(apontamento.dataFim)}
                    color={getStatusColor(apontamento.dataFim)}
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => router.push(`/apontamentos/${apontamento.id}`)}
                    >
                      Ver
                    </Button>
                    {!apontamento.dataFim && (
                      <FinalizeApontamentoButton
                        apontamentoId={apontamento.id}
                        onSuccess={() => window.location.reload()}
                      />
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Resumo */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Resumo da Produção
          </Typography>
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Total de Apontamentos
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {apontamentos.length}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Total Produzido
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {apontamentos.reduce((sum, ap) => sum + ap.quantidadeProduzida, 0)}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Total com Defeito
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="error.main">
                {apontamentos.reduce((sum, ap) => sum + ap.quantidadeDefeito, 0)}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Taxa de Defeito Média
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="warning.main">
                {apontamentos.length > 0 
                  ? ((apontamentos.reduce((sum, ap) => sum + ap.quantidadeDefeito, 0) / 
                      apontamentos.reduce((sum, ap) => sum + ap.quantidadeProduzida, 0)) * 100).toFixed(2)
                  : '0'}%
              </Typography>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
    </Box>
  );
}
