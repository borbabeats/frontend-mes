"use client";

import { Grid, Paper, Typography, Box, Card, CardContent } from "@mui/material";
import { useGetIdentity, useIsAuthenticated } from "@refinedev/core";
import { useDataGrid } from "@refinedev/mui";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export default function DashboardPage() {
  const { isError } = useIsAuthenticated();
  const router = useRouter();
  const { data: user } = useGetIdentity<IUser>();
  const { dataGridProps } = useDataGrid({
    resource: "dashboard",
    syncWithLocation: false,
  });

  useEffect(() => {
    if (isError) {
      router.push("/login");
    }
  }, [isError, router]);

  // Dados de exemplo para os cards do dashboard
  const stats = [
    { title: "Total de Usuários", value: "1,234", change: "+12%" },
    { title: "Novos Pedidos", value: "42", change: "+5%" },
    { title: "Vendas Hoje", value: "R$ 8,540", change: "+8.2%" },
    { title: "Taxa de Conversão", value: "3.2%", change: "-0.5%" },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Olá, {user?.name || "Usuário"}!
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Aqui está um resumo das suas atividades
      </Typography>

      {/* Cards de Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="h5" component="div">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}>
                  {stat.change} em relação ao mês passado
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Seção de Atividades Recentes */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Atividades Recentes
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Nenhuma atividade recente para exibir.
        </Typography>
      </Paper>

      {/* Seção de Gráficos (pode ser substituída por componentes reais de gráfico) */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Desempenho Mensal
            </Typography>
            <Box height={300} display="flex" alignItems="center" justifyContent="center">
              <Typography color="textSecondary">
                Gráfico de desempenho será exibido aqui
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Metas
            </Typography>
            <Box height={300} display="flex" alignItems="center" justifyContent="center">
              <Typography color="textSecondary">
                Metas e indicadores serão exibidos aqui
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
