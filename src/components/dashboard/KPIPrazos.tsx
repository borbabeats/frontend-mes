import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { KPICard } from './KPICard';
import DashboardService, { type KPIPrazos } from '@/services/dashboardService';
import { Schedule, Warning, TrendingDown } from '@mui/icons-material';

export const KPIPrazosComponent: React.FC = () => {
  const [data, setData] = useState<KPIPrazos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await DashboardService.getKPIPrazos();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar KPIs de prazos:', err);
        setError('Não foi possível carregar os dados de prazos');
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
          title="OPs em Atraso"
          value={data?.opsAtraso || 0}
          change={data?.opsAtraso ? -10 : undefined}
          icon={<Warning />}
          color={data?.opsAtraso ? 'error' : 'success'}
          loading={loading}
          format="number"
          unit="ordens"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KPICard
          title="Cumprimento de Prazos"
          value={data?.cumprimentoPrazos || 0}
          change={data?.cumprimentoPrazos ? 8 : undefined}
          icon={<Schedule />}
          color="success"
          loading={loading}
          format="percentage"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KPICard
          title="Tempo Médio de Ciclo"
          value={data?.tempoMedioCiclo || 0}
          change={data?.tempoMedioCiclo ? -5 : undefined}
          icon={<TrendingDown />}
          color="info"
          loading={loading}
          format="number"
          unit="horas"
        />
      </Grid>
    </Grid>
  );
};

export default KPIPrazosComponent;
