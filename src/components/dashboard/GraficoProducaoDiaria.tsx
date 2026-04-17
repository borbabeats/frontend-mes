import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import DashboardService, { type ProducaoDiaria } from '@/services/dashboardService';

interface GraficoProducaoDiariaProps {
  dias?: number;
}

export const GraficoProducaoDiaria: React.FC<GraficoProducaoDiariaProps> = ({ dias = 30 }) => {
  const [data, setData] = useState<ProducaoDiaria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<number>(dias);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await DashboardService.getProducaoDiaria(periodo);
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar produção diária:', err);
        setError('Não foi possível carregar os dados de produção diária');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [periodo]);

  const handlePeriodoChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeriodo: number | null,
  ) => {
    if (newPeriodo !== null) {
      setPeriodo(newPeriodo);
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

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">
          Produção Diária
        </Typography>
        <ToggleButtonGroup
          value={periodo}
          exclusive
          onChange={handlePeriodoChange}
          size="small"
        >
          <ToggleButton value={7}>7 dias</ToggleButton>
          <ToggleButton value={15}>15 dias</ToggleButton>
          <ToggleButton value={30}>30 dias</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="data" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: any) => `${value} unidades`}
            labelFormatter={(label) => `Data: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="planejado"
            stroke="#8884d8"
            strokeWidth={2}
            name="Planejado"
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="realizado"
            stroke="#82ca9d"
            strokeWidth={2}
            name="Realizado"
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default GraficoProducaoDiaria;
