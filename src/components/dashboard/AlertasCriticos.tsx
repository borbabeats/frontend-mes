import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import DashboardService, { type AlertaCritico } from '@/services/dashboardService';

export const AlertasCriticos: React.FC = () => {
  const [alertas, setAlertas] = useState<AlertaCritico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        setLoading(true);
        const result = await DashboardService.getAlertasCriticos();
        setAlertas(Array.isArray(result) ? result : []);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar alertas críticos:', err);
        setError('Não foi possível carregar os alertas críticos');
        setAlertas([]); // Garantir array vazio em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchAlertas();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAlertas();
    }, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval);
  }, []);

  const fetchAlertas = async () => {
    try {
      const result = await DashboardService.getAlertasCriticos();
      setAlertas(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error('Erro ao atualizar alertas:', err);
      setAlertas([]);
    }
  };

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case 'maquina':
        return <ErrorIcon color="error" />;
      case 'op':
        return <WarningIcon color="warning" />;
      case 'qualidade':
        return <InfoIcon color="info" />;
      default:
        return <WarningIcon color="warning" />;
    }
  };

  const getGravidadeColor = (gravidade: string) => {
    switch (gravidade) {
      case 'alta':
        return 'error';
      case 'media':
        return 'warning';
      case 'baixa':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">
          Alertas Críticos
        </Typography>
        <Tooltip title="Atualizar alertas">
          <IconButton onClick={fetchAlertas} size="small">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {(!alertas || alertas.length === 0) ? (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight={200}
          color="text.secondary"
        >
          <Typography variant="body1">
            Nenhum alerta crítico no momento
          </Typography>
          <Typography variant="body2">
            Sistema operando normalmente
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {alertas.map((alerta) => (
            <ListItem
              key={alerta.id}
              sx={{
                mb: 1,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>
                {getAlertIcon(alerta.tipo)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" fontWeight="medium">
                      {alerta.mensagem}
                    </Typography>
                    <Chip
                      label={alerta.gravidade.toUpperCase()}
                      size="small"
                      color={getGravidadeColor(alerta.gravidade) as any}
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  </Box>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {formatarData(alerta.data)}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      {alertas && alertas.length > 0 && (
        <Box mt={2} pt={2} borderTop={1} borderColor="divider">
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {alertas.length} alerta{alertas.length > 1 ? 's' : ''} crítico{alertas.length > 1 ? 's' : ''} ativo{alertas.length > 1 ? 's' : ''}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default AlertasCriticos;
