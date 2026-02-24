'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Grid2
} from '@mui/material';
import { Clear, Search } from '@mui/icons-material';

interface ManutencaoFiltersProps {
  onFiltersChange: (filters: any[]) => void;
}

export default function ManutencaoFilters({ onFiltersChange }: ManutencaoFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [maquinaId, setMaquinaId] = useState('');

  const handleSearch = () => {
    const filters: any[] = [];

    if (searchTerm) {
      filters.push({
        field: 'search',
        operator: 'contains',
        value: searchTerm
      });
    }

    if (status) {
      filters.push({
        field: 'status',
        operator: 'eq',
        value: status
      });
    }

    if (prioridade) {
      filters.push({
        field: 'prioridade',
        operator: 'eq',
        value: prioridade
      });
    }

    if (maquinaId) {
      filters.push({
        field: 'maquinaId',
        operator: 'eq',
        value: parseInt(maquinaId)
      });
    }

    onFiltersChange(filters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatus('');
    setPrioridade('');
    setMaquinaId('');
    onFiltersChange([]);
  };

  const handleQuickFilter = (filterType: string) => {
    let filters: any[] = [];

    switch (filterType) {
      case 'agendadas':
        filters = [{ field: 'status', operator: 'eq', value: 'AGENDADA' }];
        break;
      case 'em-andamento':
        filters = [{ field: 'status', operator: 'eq', value: 'EM_ANDAMENTO' }];
        break;
      case 'atrasadas':
        filters = [{ field: 'status', operator: 'eq', value: 'ATRASADA' }];
        break;
      case 'concluidas':
        filters = [{ field: 'status', operator: 'eq', value: 'CONCLUIDA' }];
        break;
      case 'canceladas':
        filters = [{ field: 'status', operator: 'eq', value: 'CANCELADA' }];
        break;
      default:
        filters = [];
    }

    onFiltersChange(filters);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Filtros de Manutenção
        </Typography>

        {/* Filtros Rápidos */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Filtros Rápidos:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => handleQuickFilter('')}
            >
              Todas
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              color="primary"
              onClick={() => handleQuickFilter('agendadas')}
            >
              Agendadas
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              color="info"
              onClick={() => handleQuickFilter('em-andamento')}
            >
              Em Andamento
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              color="warning"
              onClick={() => handleQuickFilter('atrasadas')}
            >
              Atrasadas
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              color="success"
              onClick={() => handleQuickFilter('concluidas')}
            >
              Concluídas
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              color="error"
              onClick={() => handleQuickFilter('canceladas')}
            >
              Canceladas
            </Button>
          </Stack>
        </Box>

        {/* Filtros Avançados */}
        <Grid2 container spacing={2} alignItems="end">
          <Grid2 size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Buscar por título ou descrição"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="AGENDADA">Agendada</MenuItem>
                <MenuItem value="EM_ANDAMENTO">Em Andamento</MenuItem>
                <MenuItem value="CONCLUIDA">Concluída</MenuItem>
                <MenuItem value="CANCELADA">Cancelada</MenuItem>
                <MenuItem value="ATRASADA">Atrasada</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Prioridade</InputLabel>
              <Select
                value={prioridade}
                label="Prioridade"
                onChange={(e) => setPrioridade(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="BAIXA">Baixa</MenuItem>
                <MenuItem value="MEDIA">Média</MenuItem>
                <MenuItem value="ALTA">Alta</MenuItem>
                <MenuItem value="URGENTE">Urgente</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              label="ID da Máquina"
              value={maquinaId}
              onChange={(e) => setMaquinaId(e.target.value)}
              size="small"
              type="number"
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 3 }}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<Search />}
                onClick={handleSearch}
                size="small"
              >
                Filtrar
              </Button>
              <IconButton onClick={handleClearFilters} size="small">
                <Clear />
              </IconButton>
            </Stack>
          </Grid2>
        </Grid2>

        {/* Filtros ativos */}
        {(searchTerm || status || prioridade || maquinaId) && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Filtros ativos:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {searchTerm && (
                <Chip
                  label={`Busca: ${searchTerm}`}
                  onDelete={() => setSearchTerm('')}
                  size="small"
                />
              )}
              {status && (
                <Chip
                  label={`Status: ${status}`}
                  onDelete={() => setStatus('')}
                  size="small"
                />
              )}
              {prioridade && (
                <Chip
                  label={`Prioridade: ${prioridade}`}
                  onDelete={() => setPrioridade('')}
                  size="small"
                />
              )}
              {maquinaId && (
                <Chip
                  label={`Máquina: ${maquinaId}`}
                  onDelete={() => setMaquinaId('')}
                  size="small"
                />
              )}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
