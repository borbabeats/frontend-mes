"use client";

import { Grid, Typography, Box, Paper, Tabs, Tab } from "@mui/material";
import { useGetIdentity, useIsAuthenticated } from "@refinedev/core";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// Import components
import DashboardErrorBoundary from "@/components/dashboard/DashboardErrorBoundary";
import KPIProducaoComponent from "@/components/dashboard/KPIProducao";
import KPIQualidadeComponent from "@/components/dashboard/KPIQualidade";
import KPIRecursosComponent from "@/components/dashboard/KPIRecursos";
import KPIPrazosComponent from "@/components/dashboard/KPIPrazos";
import GraficoProducaoDiaria from "@/components/dashboard/GraficoProducaoDiaria";
import GraficoProducaoPorSetor from "@/components/dashboard/GraficoProducaoPorSetor";
import GraficoStatusOPs from "@/components/dashboard/GraficoStatusOPs";
import GraficoOEETempoReal from "@/components/dashboard/GraficoOEETempoReal";
import AlertasCriticos from "@/components/dashboard/AlertasCriticos";
import MetasDia from "@/components/dashboard/MetasDia";
import { LoadingOverlay } from "@/components/LoadingOverlay";

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function DashboardPage() {
  const { isError } = useIsAuthenticated();
  const router = useRouter();
  const { data: user } = useGetIdentity<IUser>();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isError) {
      router.push("/login");
    }
  }, [isError, router]);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box p={3}>
      <LoadingOverlay 
        isLoading={isLoading}
        message="Carregando dashboard..."
        subMessage="Buscando dados da produção"
      />
      
      <DashboardErrorBoundary>
        <Typography variant="h4" gutterBottom>
          Olá, {user?.name || "Usuário"}!
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph>
          Painel de controle do Sistema de Execução Manufatureira (MES)
        </Typography>

        {/* Abas do Dashboard */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Visão Geral" />
            <Tab label="Produção" />
            <Tab label="Qualidade" />
            <Tab label="Recursos" />
            <Tab label="Alertas" />
          </Tabs>
        </Paper>

        {/* Conteúdo das Abas */}
        <TabPanel value={tabValue} index={0}>
          <DashboardErrorBoundary>
            <Grid container spacing={3}>
              {/* KPIs Principais */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Indicadores Principais
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <KPIProducaoComponent />
              </Grid>

              {/* Gráficos Principais */}
              <Grid item xs={12} md={8}>
                <GraficoProducaoDiaria />
              </Grid>
              <Grid item xs={12} md={4}>
                <GraficoOEETempoReal />
              </Grid>

              {/* Status e Alertas */}
              <Grid item xs={12} md={6}>
                <GraficoStatusOPs />
              </Grid>
              <Grid item xs={12} md={6}>
                <AlertasCriticos />
              </Grid>
            </Grid>
          </DashboardErrorBoundary>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <DashboardErrorBoundary>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Produção e Operações
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <KPIProducaoComponent />
              </Grid>
              <Grid item xs={12} md={8}>
                <GraficoProducaoDiaria />
              </Grid>
              <Grid item xs={12} md={4}>
                <GraficoProducaoPorSetor />
              </Grid>
              <Grid item xs={12}>
                <KPIPrazosComponent />
              </Grid>
            </Grid>
          </DashboardErrorBoundary>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <DashboardErrorBoundary>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Qualidade e Conformidade
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <KPIQualidadeComponent />
              </Grid>
              <Grid item xs={12} md={6}>
                <GraficoStatusOPs />
              </Grid>
              <Grid item xs={12} md={6}>
                <MetasDia />
              </Grid>
            </Grid>
          </DashboardErrorBoundary>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <DashboardErrorBoundary>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Recursos e Equipamentos
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <KPIRecursosComponent />
              </Grid>
              <Grid item xs={12}>
                <GraficoOEETempoReal />
              </Grid>
              <Grid item xs={12} md={6}>
                <GraficoProducaoPorSetor />
              </Grid>
              <Grid item xs={12} md={6}>
                <MetasDia />
              </Grid>
            </Grid>
          </DashboardErrorBoundary>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <DashboardErrorBoundary>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Alertas e Notificações
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <AlertasCriticos />
              </Grid>
              <Grid item xs={12} md={6}>
                <MetasDia />
              </Grid>
              <Grid item xs={12}>
                <KPIPrazosComponent />
              </Grid>
            </Grid>
          </DashboardErrorBoundary>
        </TabPanel>
      </DashboardErrorBoundary>
    </Box>
  );
}
