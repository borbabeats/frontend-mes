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
} from '@mui/material';
import { 
  ExpandMore,
  Factory,
  Schedule,
  Edit,
  Close,
  Add,
  Check
} from '@mui/icons-material';
import { useDataGrid } from "@refinedev/mui";
import { useList } from '@refinedev/core';
import { formatDateTime } from '@utils/dateUtils';
import { getStatusColor, getPrioridadeColor } from '@utils/status_maquina';
import { 
  formatarStatusOP, 
  getStatusOPColor, 
  verificarOPAtrasada, 
  calcularProgressoOP 
} from '@utils/ordemProducaoStatus';
import { useRouter } from 'next/navigation';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import StatusChangeButton from '@/components/ordens-producao/StatusChangeButton';
import UpdateProductionButton from '@/components/ordens-producao/UpdateProductionButton';
import OPFilters from '@/components/ordens-producao/OPFilters';

interface OrdemProducao {
  id: number;
  codigo: string;
  produto: string;
  descricao: string;
  quantidadePlanejada: number;
  quantidadeProduzida: number;
  status: string;
  prioridade: string;
  dataFimReal: string | null;
  dataInicioReal: string;
  dataInicioPlanejado: string;
  dataFimPlanejado: string;
  observacoes: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  apontamentos?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OrdensProducaoPage() {
  const router = useRouter();
  const [currentFilters, setCurrentFilters] = useState<any[]>([]);

  const { dataGridProps } = useDataGrid({
    resource: 'ordens-producao',
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
  let ordensData: OrdemProducao[] = [];
  
  if (dataGridProps.rows && typeof dataGridProps.rows === 'object' && 'data' in dataGridProps.rows) {
    ordensData = Array.isArray(dataGridProps.rows.data) ? dataGridProps.rows.data : [];
  } else if (Array.isArray(dataGridProps.rows)) {
    ordensData = dataGridProps.rows;
  }

  const calcularProgresso = (produzida: number, planejada: number) => {
    return Math.round((produzida / planejada) * 100);
  };

  const handleEditarOP = (id: number | string) => {
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    router.push(`/ordens-producao/editar/${numericId}`);
  };

  const handleFinalizarOP = async (id: number | string) => {
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    try {
      const response = await axios.post(`${API_URL}/ordens-producao/${numericId}/finalizar`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        // Recarregar a página para mostrar os dados atualizados
        window.location.reload();
      } else {
        console.error('Erro ao finalizar OP');
      }
    } catch (error) {
      console.error('Erro ao finalizar OP:', error);
    }
  };

  const handleCancelarOP = async (id: number | string) => {
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    try {
      const response = await axios.post(`${API_URL}/ordens-producao/${numericId}/cancelar`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        // Recarregar a página para mostrar os dados atualizados
        window.location.reload();
      } else {
        console.error('Erro ao cancelar OP');
      }
    } catch (error) {
      console.error('Erro ao cancelar OP:', error);
    }
  };

  const handleNovoApontamento = (ordemId: number | string) => {
    const numericId = typeof ordemId === 'string' ? parseInt(ordemId) : ordemId;
    router.push(`/apontamentos/criar?ordemId=${numericId}`);
  };

  const handleCriarOP = () => {
    // Redirecionar para página de criação de OP ou abrir modal
    router.push('/ordens-producao/criar');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Ordens de Produção
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleCriarOP}
        >
          Nova Ordem de Produção
        </Button>
      </Box>

      {/* Filtros Avançados */}
      <OPFilters onFiltersChange={handleFiltersChange} />

      <LoadingOverlay 
        isLoading={isLoading}
        message="Carregando..."
        subMessage="Buscando ordens de produção"
      />

      {ordensData?.map((ordem) => {
        const progresso = calcularProgressoOP(ordem.quantidadeProduzida, ordem.quantidadePlanejada);
        const estaAtrasada = verificarOPAtrasada(ordem.dataFimPlanejado, ordem.status as any);
        const statusExibicao = estaAtrasada ? 'ATRASADA' : ordem.status;
        
        return (
          
          <Accordion key={ordem.id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ width: '100%' }}>
                <Grid2 container spacing={2} alignItems="center">
                  <Grid2 size={{ xs: 12, md: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Factory />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {ordem.codigo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {ordem.produto}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid2>

                  <Grid2 size={{ xs: 12, md: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Quantidade
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {ordem.quantidadeProduzida} / {ordem.quantidadePlanejada}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={progresso} 
                      sx={{ mt: 1, height: 6 }}
                    />
                  </Grid2>

                  <Grid2 size={{ xs: 6, md: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip 
                      label={formatarStatusOP(statusExibicao as any)}
                      color={getStatusOPColor(statusExibicao as any)}
                      size="small"
                    />
                  </Grid2>

                  <Grid2 size={{ xs: 6, md: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Prioridade
                    </Typography>
                    <Chip 
                      label={ordem.prioridade}
                      color={getPrioridadeColor(ordem.prioridade)}
                      size="small"
                    />
                  </Grid2>

                  <Grid2 size={{ xs: 12, md: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Prazo Planejado
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDateTime(ordem.dataFimPlanejado)}
                    </Typography>
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
                            {ordem.descricao || 'Sem descrição'}
                          </Typography>
                        </Box>

                        <Divider />

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Datas Planejadas
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Schedule fontSize="small" color="action" />
                              <Typography variant="body2">
                                Início: {formatDateTime(ordem.dataInicioPlanejado)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Schedule fontSize="small" color="action" />
                              <Typography variant="body2">
                                Fim: {formatDateTime(ordem.dataFimPlanejado)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Datas Reais
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Schedule fontSize="small" color="action" />
                              <Typography variant="body2">
                                Início: {formatDateTime(ordem.dataInicioReal)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Schedule fontSize="small" color="action" />
                              <Typography variant="body2">
                                Fim: {ordem.dataFimReal ? formatDateTime(ordem.dataFimReal) : 'Não concluída'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Progresso
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">
                                {ordem.quantidadeProduzida} unidades produzidas
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {progresso}%
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={progresso} 
                              sx={{ height: 8 }}
                            />
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
                        {ordem.observacoes || 'Nenhuma observação cadastrada'}
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
                            onClick={() => handleEditarOP(ordem.id)}
                          >
                            Editar OP
                          </Button>
                          <StatusChangeButton
                            ordemId={ordem.id}
                            statusAtual={ordem.status as any}
                            quantidadeProduzida={ordem.quantidadeProduzida}
                            quantidadePlanejada={ordem.quantidadePlanejada}
                            onSuccess={() => window.location.reload()}
                          />
                          <UpdateProductionButton
                            ordemId={ordem.id}
                            quantidadeProduzida={ordem.quantidadeProduzida}
                            quantidadeDefeitos={0} // Este valor pode vir da API se disponível
                            onSuccess={() => window.location.reload()}
                          />
                        </Stack>
                        <Stack direction="row" spacing={2} flexWrap="wrap">
                          <Button 
                            variant="outlined" 
                            color="warning"
                            startIcon={<Close />}
                            size="small"
                            disabled={ordem.status === 'FINALIZADA' || ordem.status === 'CANCELADA'}
                            onClick={() => handleCancelarOP(ordem.id)}
                          >
                            Cancelar OP
                          </Button>
                          <Button 
                            variant="outlined" 
                            color="success"
                            startIcon={<Check />}
                            size="small"
                            disabled={ordem.status === 'FINALIZADA'}
                            onClick={() => handleFinalizarOP(ordem.id)}
                          >
                            Finalizar OP
                          </Button>
                          <Button 
                            variant="contained"
                            startIcon={<Add />}
                            size="small"
                            onClick={() => handleNovoApontamento(ordem.id)}
                          >
                            Novo Apontamento
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid2>

                <Grid2 size={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Apontamentos Vinculados
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {ordem.apontamentos || 0} apontamentos encontrados
                      </Typography>
                      {/* Aqui você pode adicionar uma lista de apontamentos se necessário */}
                    </CardContent>
                  </Card>
                </Grid2>
              </Grid2>
            </AccordionDetails>
          </Accordion>
        );
      })}

      {(!ordensData || ordensData.length === 0) && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Nenhuma ordem de produção encontrada
          </Typography>
        </Box>
      )}
    </Box>
  );
}