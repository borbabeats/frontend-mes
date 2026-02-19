'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid2,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore, Clear, FilterList } from '@mui/icons-material';
import { useList } from '@refinedev/core';

interface OPFiltersProps {
  onFiltersChange: (filters: any[]) => void;
}

export default function OPFilters({ onFiltersChange }: OPFiltersProps) {
  const [filters, setFilters] = useState({
    status: '',
    setorId: '',
    responsavelId: '',
    prioridade: '',
    search: ''
  });

  // Carregar dados para os selects
  const { result: { data: setoresData } } = useList({
    resource: 'setores',
    pagination: { mode: 'off' }
  });

  const { result: { data: usuariosData } } = useList({
    resource: 'usuarios',
    pagination: { mode: 'off' }
  });

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    // Construir filtros para o Refine
    const refineFilters = [];
    
    if (newFilters.status) {
      refineFilters.push({
        field: 'status',
        operator: 'eq',
        value: newFilters.status
      });
    }
    
    if (newFilters.setorId) {
      refineFilters.push({
        field: 'setorId',
        operator: 'eq',
        value: Number(newFilters.setorId)
      });
    }
    
    if (newFilters.responsavelId) {
      refineFilters.push({
        field: 'responsavelId',
        operator: 'eq',
        value: Number(newFilters.responsavelId)
      });
    }
    
    if (newFilters.prioridade) {
      refineFilters.push({
        field: 'prioridade',
        operator: 'eq',
        value: newFilters.prioridade
      });
    }
    
    if (newFilters.search) {
      refineFilters.push({
        field: 'search',
        operator: 'contains',
        value: newFilters.search
      });
    }
    
    onFiltersChange(refineFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: '',
      setorId: '',
      responsavelId: '',
      prioridade: '',
      search: ''
    };
    setFilters(clearedFilters);
    onFiltersChange([]);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const statusOptions = [
    { value: 'RASCUNHO', label: 'Rascunho' },
    { value: 'PLANEJADA', label: 'Planejada' },
    { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
    { value: 'PAUSADA', label: 'Pausada' },
    { value: 'FINALIZADA', label: 'Finalizada' },
    { value: 'CANCELADA', label: 'Cancelada' }
  ];

  const prioridadeOptions = [
    { value: 'BAIXA', label: 'Baixa' },
    { value: 'MEDIA', label: 'Média' },
    { value: 'ALTA', label: 'Alta' },
    { value: 'URGENTE', label: 'Urgente' }
  ];

  return (
    <Accordion defaultExpanded={hasActiveFilters}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FilterList />
          <Typography variant="h6">Filtros Avançados</Typography>
          {hasActiveFilters && (
            <Chip 
              label="Filtros ativos" 
              color="primary" 
              size="small" 
            />
          )}
        </Box>
      </AccordionSummary>
      
      <AccordionDetails>
        <Card>
          <CardContent>
            <Grid2 container spacing={3}>
              {/* Busca geral */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Buscar por código, produto ou descrição"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Ex: OP-001, Eixo, Pedido..."
                />
              </Grid2>

              {/* Status */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <MenuItem value="">Todos os status</MenuItem>
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid2>

              {/* Setor */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Setor</InputLabel>
                  <Select
                    value={filters.setorId}
                    label="Setor"
                    onChange={(e) => handleFilterChange('setorId', e.target.value)}
                  >
                    <MenuItem value="">Todos os setores</MenuItem>
                    {setoresData?.map((setor: any) => (
                      <MenuItem key={setor.id} value={setor.id}>
                        {setor.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid2>

              {/* Responsável */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Responsável</InputLabel>
                  <Select
                    value={filters.responsavelId}
                    label="Responsável"
                    onChange={(e) => handleFilterChange('responsavelId', e.target.value)}
                  >
                    <MenuItem value="">Todos os responsáveis</MenuItem>
                    {usuariosData?.map((usuario: any) => (
                      <MenuItem key={usuario.id} value={usuario.id}>
                        {usuario.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid2>

              {/* Prioridade */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Prioridade</InputLabel>
                  <Select
                    value={filters.prioridade}
                    label="Prioridade"
                    onChange={(e) => handleFilterChange('prioridade', e.target.value)}
                  >
                    <MenuItem value="">Todas as prioridades</MenuItem>
                    {prioridadeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid2>

              {/* Botões de ação */}
              <Grid2 size={{ xs: 12 }}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    startIcon={<Clear />}
                    onClick={handleClearFilters}
                    disabled={!hasActiveFilters}
                  >
                    Limpar Filtros
                  </Button>
                </Stack>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>
      </AccordionDetails>
    </Accordion>
  );
}
