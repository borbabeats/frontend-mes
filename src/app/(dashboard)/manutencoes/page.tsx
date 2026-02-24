'use client';

import axios from 'axios';
import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Chip,
  LinearProgress,
  Button,
  Grid2,
  Card,
  CardContent,
  Avatar,
  Divider,
  Stack,
  Pagination,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from '@mui/material';
import { 
  ExpandMore,
  Build,
  Schedule,
  Edit,
  Close,
  Add,
  Check,
  PlayArrow,
  Warning
} from '@mui/icons-material';
import { useDataGrid } from "@refinedev/mui";
import { useList } from '@refinedev/core';
import { formatDateTime } from '@utils/dateUtils';
import { getStatusManutencaoColor, getPrioridadeManutencaoColor, verificarManutencaoAtrasada, calcularDuracaoManutencao, formatarStatusManutencao, podeCancelarManutencao, podeFinalizarManutencao, podeIniciarManutencao } from '@utils/manutencaoStatus';
import { useRouter } from 'next/navigation';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import ManutencaoFilters from '@/components/manutencoes/ManutencaoFilters';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ManutencoesPage() {
  const router = useRouter();
  const [currentFilters, setCurrentFilters] = useState<any[]>([]);

  const { dataGridProps } = useDataGrid({
    resource: 'manutencoes',
    pagination: {
      mode: 'server',
      pageSize: 10,
    },
    sorters: {
      mode: 'server',
      initial: [
        {
          field: 'createdAt',
          order: 'desc',
        },
      ],
    },
    filters: {
      mode: 'server',
      permanent: currentFilters,
    },
    syncWithLocation: true,
  });

  const handleFiltersChange = (filters: any[]) => {
    setCurrentFilters(filters);
  };

  // Verificar estado de loading
  const isLoading = dataGridProps.loading || false;

  // Os dados podem estar em dataGridProps.rows.data ou diretamente em dataGridProps.rows
  let manutencoesData: any[] = [];
  
  if (dataGridProps.rows && typeof dataGridProps.rows === 'object' && 'data' in dataGridProps.rows) {
    manutencoesData = Array.isArray(dataGridProps.rows.data) ? dataGridProps.rows.data : [];
  } else if (Array.isArray(dataGridProps.rows)) {
    manutencoesData = dataGridProps.rows;
  }

  const handleEditarManutencao = (id: number | string) => {
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    router.push(`/manutencoes/editar/${numericId}`);
  };

  const handleCancelarManutencao = async (id: number | string) => {
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    try {
      const response = await axios.patch(`${API_URL}/manutencoes/${numericId}/cancelar`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error('Erro ao cancelar manutenção');
      }
    } catch (error) {
      console.error('Erro ao cancelar manutenção:', error);
    }
  };

  const handleIniciarManutencao = async (id: number | string, maquinaId: number) => {
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    try {
      const response = await axios.post(`${API_URL}/maquinas/${maquinaId}/manutencoes`, {
        manutencaoId: numericId
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error('Erro ao iniciar manutenção');
      }
    } catch (error) {
      console.error('Erro ao iniciar manutenção:', error);
    }
  };

  const handleFinalizarManutencao = async (id: number | string, maquinaId: number) => {
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    try {
      const response = await axios.patch(`${API_URL}/maquinas/${maquinaId}/manutencoes/finalizar`, {
        manutencaoId: numericId
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error('Erro ao finalizar manutenção');
      }
    } catch (error) {
      console.error('Erro ao finalizar manutenção:', error);
    }
  };

  const handleCriarManutencao = () => {
    router.push('/manutencoes/criar');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Manutenções
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleCriarManutencao}
        >
          Nova Manutenção
        </Button>
      </Box>

      {/* Filtros Avançados */}
      <ManutencaoFilters onFiltersChange={handleFiltersChange} />

      <LoadingOverlay 
        isLoading={isLoading}
        message="Carregando..."
        subMessage="Buscando manutenções"
      />

      {manutencoesData?.map((manutencao) => {
        const estaAtrasada = verificarManutencaoAtrasada(manutencao.dataAgendada, manutencao.status);
        const statusExibicao = estaAtrasada && manutencao.status !== 'CONCLUIDA' && manutencao.status !== 'CANCELADA' ? 'ATRASADA' : manutencao.status;
        const duracao = calcularDuracaoManutencao(manutencao.dataInicio, manutencao.dataFim);
        
        return (
          <Accordion key={manutencao.id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ width: '100%' }}>
                <Grid2 container spacing={2} alignItems="center">
                  <Grid2 size={{ xs: 12, md: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        <Build />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {manutencao.titulo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {manutencao.maquina?.nome || `Máquina ${manutencao.maquinaId}`}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid2>

                  <Grid2 size={{ xs: 6, md: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip 
                      label={formatarStatusManutencao(statusExibicao)}
                      color={getStatusManutencaoColor(statusExibicao)}
                      size="small"
                    />
                  </Grid2>

                  <Grid2 size={{ xs: 6, md: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Prioridade
                    </Typography>
                    <Chip 
                      label={manutencao.prioridade}
                      color={getPrioridadeManutencaoColor(manutencao.prioridade)}
                      size="small"
                    />
                  </Grid2>

                  <Grid2 size={{ xs: 12, md: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Data Agendada
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDateTime(manutencao.dataAgendada)}
                    </Typography>
                    {duracao !== '-' && (
                      <Typography variant="body2" color="text.secondary">
                        Duração: {duracao}
                      </Typography>
                    )}
                  </Grid2>

                  <Grid2 size={{ xs: 12, md: 2 }}>
                    {estaAtrasada && manutencao.status !== 'CONCLUIDA' && manutencao.status !== 'CANCELADA' && (
                      <Chip 
                        icon={<Warning />}
                        label="Atrasada"
                        color="warning"
                        size="small"
                      />
                    )}
                  </Grid2>
                </Grid2>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Informações Gerais
                      </Typography>
                      
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Descrição
                          </Typography>
                          <Typography variant="body1">
                            {manutencao.descricao || 'Sem descrição'}
                          </Typography>
                        </Box>

                        <Divider />

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Máquina
                          </Typography>
                          <Typography variant="body1">
                            {manutencao.maquina?.nome || `Máquina ${manutencao.maquinaId}`}
                            {manutencao.maquina?.codigo && (
                              <Typography variant="body2" color="text.secondary">
                                Código: {manutencao.maquina.codigo}
                              </Typography>
                            )}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Técnico Responsável
                          </Typography>
                          <Typography variant="body1">
                            {manutencao.tecnicoResponsavel || 'Não atribuído'}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Datas
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Schedule fontSize="small" color="action" />
                              <Typography variant="body2">
                                Agendada: {formatDateTime(manutencao.dataAgendada)}
                              </Typography>
                            </Box>
                            {manutencao.dataInicio && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PlayArrow fontSize="small" color="action" />
                                <Typography variant="body2">
                                  Início: {formatDateTime(manutencao.dataInicio)}
                                </Typography>
                              </Box>
                            )}
                            {manutencao.dataFim && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Check fontSize="small" color="action" />
                                <Typography variant="body2">
                                  Fim: {formatDateTime(manutencao.dataFim)}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Observações
                      </Typography>
                      <Typography variant="body1">
                        {manutencao.observacoes || 'Nenhuma observação cadastrada'}
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="h6" gutterBottom>
                        Ações Rápidas
                      </Typography>
                      <Stack direction="column" spacing={2}>
                        <Stack direction="row" spacing={2} flexWrap="wrap">
                          <Button 
                            variant="outlined" 
                            startIcon={<Edit />}
                            size="small"
                            onClick={() => handleEditarManutencao(manutencao.id)}
                          >
                            Editar
                          </Button>
                          
                          {podeIniciarManutencao(manutencao.status) && (
                            <Button 
                              variant="contained"
                              color="primary"
                              startIcon={<PlayArrow />}
                              size="small"
                              onClick={() => handleIniciarManutencao(manutencao.id, manutencao.maquinaId)}
                            >
                              Iniciar
                            </Button>
                          )}
                          
                          {podeFinalizarManutencao(manutencao.status) && (
                            <Button 
                              variant="contained"
                              color="success"
                              startIcon={<Check />}
                              size="small"
                              onClick={() => handleFinalizarManutencao(manutencao.id, manutencao.maquinaId)}
                            >
                              Finalizar
                            </Button>
                          )}
                          
                          {podeCancelarManutencao(manutencao.status) && (
                            <Button 
                              variant="outlined" 
                              color="error"
                              startIcon={<Close />}
                              size="small"
                              onClick={() => handleCancelarManutencao(manutencao.id)}
                            >
                              Cancelar
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid2>
              </Grid2>
            </AccordionDetails>
          </Accordion>
        );
      })}

      {(!manutencoesData || manutencoesData.length === 0) && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Nenhuma manutenção encontrada
          </Typography>
        </Box>
      )}
    </Box>
  );
}
