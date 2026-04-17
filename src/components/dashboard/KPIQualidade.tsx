import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { KPICard } from './KPICard';
import DashboardService, { type KPIQualidade } from '@/services/dashboardService';
import { Verified, Warning, TrendingUp } from '@mui/icons-material';

export const KPIQualidadeComponent: React.FC = () => {
  const [data, setData] = useState<KPIQualidade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await DashboardService.getKPIQualidade();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar KPIs de qualidade:', err);
        setError('Não foi possível carregar os dados de qualidade');
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
          title="Índice de Qualidade"
          value={data?.indiceQualidade || 0}
          change={data?.indiceQualidade ? 3 : undefined}
          icon={<Verified />}
          color="success"
          loading={loading}
          format="percentage"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KPICard
          title="Rejeições do Mês"
          value={data?.rejeicoesMes || 0}
          change={data?.rejeicoesMes ? -15 : undefined}
          icon={<Warning />}
          color="warning"
          loading={loading}
          format="number"
          unit="unidades"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KPICard
          title="Conformidade"
          value={data?.conformidade || 0}
          change={data?.conformidade ? 2 : undefined}
          icon={<TrendingUp />}
          color="info"
          loading={loading}
          format="percentage"
        />
      </Grid>
    </Grid>
  );
};

export default KPIQualidadeComponent;
