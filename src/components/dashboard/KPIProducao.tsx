import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { KPICard } from './KPICard';
import DashboardService, { type KPIProducao } from '@/services/dashboardService';
import { Factory, TrendingUp, Warning } from '@mui/icons-material';

export const KPIProducaoComponent: React.FC = () => {
  const [data, setData] = useState<KPIProducao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await DashboardService.getKPIProducao();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar KPIs de produção:', err);
        setError('Não foi possível carregar os dados de produção');
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
      <Grid item xs={12} sm={6} md={3}>
        <KPICard
          title="OPs Ativas"
          value={data?.opsAtivas || 0}
          change={data?.opsAtivas ? 5 : undefined}
          icon={<Factory />}
          color="primary"
          loading={loading}
          format="number"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <KPICard
          title="Produção do Dia"
          value={data?.producaoDia || 0}
          change={data?.producaoDia ? 8 : undefined}
          icon={<TrendingUp />}
          color="success"
          loading={loading}
          format="number"
          unit="unidades"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <KPICard
          title="Eficiência Global"
          value={data?.eficienciaGlobal || 0}
          change={data?.eficienciaGlobal ? 2 : undefined}
          icon={<TrendingUp />}
          color="info"
          loading={loading}
          format="percentage"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <KPICard
          title="Taxa de Defeitos"
          value={data?.taxaDefeitos || 0}
          change={data?.taxaDefeitos ? -1 : undefined}
          icon={<Warning />}
          color={(data?.taxaDefeitos ?? 0) > 5 ? 'error' : 'warning'}
          loading={loading}
          format="percentage"
        />
      </Grid>
    </Grid>
  );
};

export default KPIProducaoComponent;
