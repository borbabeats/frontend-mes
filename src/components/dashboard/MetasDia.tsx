import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import DashboardService, { type MetaDia } from '@/services/dashboardService';

export const MetasDia: React.FC = () => {
  const [metas, setMetas] = useState<MetaDia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetas = async () => {
      try {
        setLoading(true);
        const result = await DashboardService.getMetasDia();
        setMetas(Array.isArray(result) ? result : []);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar metas do dia:', err);
        setError('Não foi possível carregar as metas do dia');
        setMetas([]); // Garantir array vazio em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchMetas();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMetas();
    }, 120000); // Atualiza a cada 2 minutos

    return () => clearInterval(interval);
  }, []);

  const fetchMetas = async () => {
    try {
      const result = await DashboardService.getMetasDia();
      setMetas(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error('Erro ao atualizar metas:', err);
      setMetas([]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluida':
        return <CheckCircleIcon color="success" />;
      case 'andamento':
        return <ScheduleIcon color="info" />;
      case 'atrasada':
        return <WarningIcon color="warning" />;
      default:
        return <ScheduleIcon color="disabled" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'success';
      case 'andamento':
        return 'info';
      case 'atrasada':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'Concluída';
      case 'andamento':
        return 'Em Andamento';
      case 'atrasada':
        return 'Atrasada';
      default:
        return 'Desconhecido';
    }
  };

  const getProgressColor = (percentual: number, status: string) => {
    if (status === 'concluida') return 'success';
    if (status === 'atrasada') return 'warning';
    if (percentual >= 80) return 'success';
    if (percentual >= 50) return 'info';
    return 'warning';
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Box display="flex" alignItems="center" justifyContent="center" minHeight={200}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Metas do Dia
      </Typography>

      {(!metas || metas.length === 0) ? (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight={200}
          color="text.secondary"
        >
          <Typography variant="body1">
            Nenhuma meta cadastrada para hoje
          </Typography>
          <Typography variant="body2">
            Configure metas diárias para acompanhar o progresso
          </Typography>
        </Box>
      ) : (
        <Box>
          {metas.map((meta) => (
            <Box key={meta.id} sx={{ mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  {getStatusIcon(meta.status)}
                  <Typography variant="body2" fontWeight="medium">
                    {meta.descricao}
                  </Typography>
                </Box>
                <Chip
                  label={getStatusText(meta.status)}
                  size="small"
                  color={getStatusColor(meta.status) as any}
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              </Box>

              <Box mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Progresso: {meta.atual} / {meta.meta} ({meta.percentual}%)
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={Math.min(meta.percentual, 100)}
                color={getProgressColor(meta.percentual, meta.status) as any}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  mb: 1
                }}
              />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  {meta.atual} unidades produzidas
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {meta.percentual}% completo
                </Typography>
              </Box>
            </Box>
          ))}

          {metas && metas.length > 0 && (
            <Box mt={2} pt={2} borderTop={1} borderColor="divider">
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {metas.filter(m => m.status === 'concluida').length} de {metas.length} meta{metas.length > 1 ? 's' : ''} concluída{metas.filter(m => m.status === 'concluida').length > 1 ? 's' : ''}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default MetasDia;
