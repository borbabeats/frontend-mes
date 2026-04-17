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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import DashboardService, { type ProducaoPorSetor } from '@/services/dashboardService';

export const GraficoProducaoPorSetor: React.FC = () => {
  const [data, setData] = useState<ProducaoPorSetor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<string>('mes');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await DashboardService.getProducaoPorSetor(periodo);
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar produção por setor:', err);
        setError('Não foi possível carregar os dados de produção por setor');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [periodo]);

  const handlePeriodoChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeriodo: string | null,
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
          Produção por Setor
        </Typography>
        <ToggleButtonGroup
          value={periodo}
          exclusive
          onChange={handlePeriodoChange}
          size="small"
        >
          <ToggleButton value="semana">Semana</ToggleButton>
          <ToggleButton value="mes">Mês</ToggleButton>
          <ToggleButton value="ano">Ano</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="setor" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: any) => `${value} unidades`}
            labelFormatter={(label) => `Setor: ${label}`}
          />
          <Legend />
          <Bar
            dataKey="quantidade"
            fill="#8884d8"
            name="Quantidade Produzida"
          />
          <Bar
            dataKey="eficiencia"
            fill="#82ca9d"
            name="Eficiência (%)"
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default GraficoProducaoPorSetor;
