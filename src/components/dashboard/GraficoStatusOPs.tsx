import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import DashboardService, { type StatusOP } from '@/services/dashboardService';

const COLORS = {
  'EM_ANDAMENTO': '#FFA726',
  'CONCLUIDA': '#66BB6A',
  'ATRASADA': '#EF5350',
  'CANCELADA': '#9E9E9E',
  'PLANEJADA': '#42A5F5'
};

export const GraficoStatusOPs: React.FC = () => {
  const [data, setData] = useState<StatusOP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await DashboardService.getStatusOPs();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar status das OPs:', err);
        setError('Não foi possível carregar os dados de status das OPs');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Status das Ordens de Produção
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="quantidade"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.status as keyof typeof COLORS] || '#8884d8'} 
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => `${value} OPs`}
          />
          <Legend 
            formatter={(value: string, entry: any) => (
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  width={12}
                  height={12}
                  bgcolor={COLORS[entry.payload.status as keyof typeof COLORS] || '#8884d8'}
                  borderRadius={2}
                />
                <Typography variant="body2">
                  {entry.payload.status} ({entry.payload.quantidade})
                </Typography>
              </Box>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
        {data.map((item) => (
          <Chip
            key={item.status}
            label={`${item.status}: ${item.quantidade}`}
            size="small"
            sx={{
              bgcolor: COLORS[item.status as keyof typeof COLORS] || '#8884d8',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default GraficoStatusOPs;
