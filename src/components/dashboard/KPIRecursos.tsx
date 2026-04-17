import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { KPICard } from './KPICard';
import DashboardService, { type KPIRecursos } from '@/services/dashboardService';
import { PrecisionManufacturing, Speed, AccessTime } from '@mui/icons-material';

export const KPIRecursosComponent: React.FC = () => {
  const [data, setData] = useState<KPIRecursos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await DashboardService.getKPIRecursos();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar KPIs de recursos:', err);
        setError('Não foi possível carregar os dados de recursos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <KPICard
          title="Máquinas Ativas"
          value={data?.maquinasAtivas || 0}
          change={data?.maquinasAtivas ? 0 : undefined}
          icon={<PrecisionManufacturing />}
          color="primary"
          loading={loading}
          format="number"
          unit="equipamentos"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KPICard
          title="Taxa de OEE"
          value={data?.taxaOEE || 0}
          change={data?.taxaOEE ? 5 : undefined}
          icon={<Speed />}
          color={data?.taxaOEE ? (data.taxaOEE >= 85 ? 'success' : data.taxaOEE >= 65 ? 'warning' : 'error') : 'info'}
          loading={loading}
          format="percentage"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KPICard
          title="Disponibilidade"
          value={data?.disponibilidade || 0}
          change={data?.disponibilidade ? 2 : undefined}
          icon={<AccessTime />}
          color="info"
          loading={loading}
          format="percentage"
        />
      </Grid>
    </Grid>
  );
};

export default KPIRecursosComponent;
