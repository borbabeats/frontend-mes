import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis
} from 'recharts';
import DashboardService, { type OEETempoReal } from '@/services/dashboardService';

export const GraficoOEETempoReal: React.FC = () => {
  const [data, setData] = useState<OEETempoReal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await DashboardService.getOEETempoReal();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar OEE em tempo real:', err);
        setError('Não foi possível carregar os dados de OEE');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const result = await DashboardService.getOEETempoReal();
      setData(result);
    } catch (err) {
      console.error('Erro ao atualizar OEE:', err);
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Box display="flex" alignItems="center" justifyContent="center" minHeight={300}>
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

  const gaugeData = [
    {
      name: 'OEE',
      value: data?.valor || 0,
      fill: data?.status === 'otimo' ? '#4caf50' : 
            data?.status === 'regular' ? '#ff9800' : '#f44336'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'otimo': return 'success.main';
      case 'regular': return 'warning.main';
      case 'critico': return 'error.main';
      default: return 'text.secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'otimo': return 'Ótimo';
      case 'regular': return 'Regular';
      case 'critico': return 'Crítico';
      default: return 'Desconhecido';
    }
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">
          OEE em Tempo Real
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            width={12}
            height={12}
            borderRadius="50%"
            bgcolor={getStatusColor(data?.status || '')}
            sx={{ animation: 'pulse 2s infinite' }}
          />
          <Typography variant="body2" color={getStatusColor(data?.status || '')}>
            {getStatusText(data?.status || '')}
          </Typography>
        </Box>
      </Box>

      <ResponsiveContainer width="100%" height={200}>
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="60%" 
          outerRadius="90%" 
          data={gaugeData}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
            fill={gaugeData[0].fill}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <Box textAlign="center" mt={2}>
        <Typography variant="h3" fontWeight="bold" color={getStatusColor(data?.status || '')}>
          {data?.valor || 0}%
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Eficiência Global dos Equipamentos
        </Typography>
      </Box>

      <Box mt={3}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Disponibilidade: {data?.disponibilidade || 0}%
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={data?.disponibilidade || 0} 
          sx={{ mb: 2, height: 6 }}
        />

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Performance: {data?.performance || 0}%
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={data?.performance || 0} 
          sx={{ mb: 2, height: 6 }}
          color="warning"
        />

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Qualidade: {data?.qualidade || 0}%
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={data?.qualidade || 0} 
          sx={{ mb: 1, height: 6 }}
          color="success"
        />
      </Box>
    </Paper>
  );
};

export default GraficoOEETempoReal;
