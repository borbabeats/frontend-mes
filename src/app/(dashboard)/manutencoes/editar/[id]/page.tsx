'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid2,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Avatar
} from '@mui/material';
import { Save, ArrowBack, Build, Schedule, Check, PlayArrow, Close } from '@mui/icons-material';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { formatDateTime } from '@utils/dateUtils';
import { formatarStatusManutencao, getStatusManutencaoColor, getPrioridadeManutencaoColor, calcularDuracaoManutencao, podeCancelarManutencao, podeFinalizarManutencao, podeIniciarManutencao } from '@utils/manutencaoStatus';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Manutencao {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  dataAgendada: string;
  dataInicio?: string | null;
  dataFim?: string | null;
  maquinaId: number;
  maquina?: {
    id: number;
    nome: string;
    codigo: string;
  };
  tecnicoResponsavel?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditarManutencaoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [manutencao, setManutencao] = useState<Manutencao | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'MEDIA',
    dataAgendada: '',
    tecnicoResponsavel: '',
    observacoes: ''
  });

  useEffect(() => {
    carregarManutencao();
  }, [id]);

  const carregarManutencao = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/manutencoes/${id}`);
      
      if (response.data) {
        const data = response.data;
        setManutencao(data);
        setFormData({
          titulo: data.titulo || '',
          descricao: data.descricao || '',
          prioridade: data.prioridade || 'MEDIA',
          dataAgendada: data.dataAgendada ? new Date(data.dataAgendada).toISOString().slice(0, 16) : '',
          tecnicoResponsavel: data.tecnicoResponsavel || '',
          observacoes: data.observacoes || ''
        });
      }
    } catch (err: any) {
      console.error('Erro ao carregar manutenção:', err);
      setError(err.response?.data?.message || 'Erro ao carregar manutenção');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string) => (
    event: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.titulo.trim()) {
      setError('O título é obrigatório');
      return false;
    }
    if (!formData.descricao.trim()) {
      setError('A descrição é obrigatória');
      return false;
    }
    if (!formData.dataAgendada) {
      setError('A data agendada é obrigatória');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        dataAgendada: new Date(formData.dataAgendada).toISOString()
      };

      const response = await axios.patch(`${API_URL}/manutencoes/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/manutencoes');
        }, 2000);
      } else {
        setError('Erro ao atualizar manutenção');
      }
    } catch (err: any) {
      console.error('Erro ao atualizar manutenção:', err);
      setError(err.response?.data?.message || 'Erro ao atualizar manutenção');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelar = async () => {
    if (!manutencao) return;
    
    try {
      setSaving(true);
      const response = await axios.patch(`${API_URL}/manutencoes/${id}/cancelar}`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/manutencoes');
        }, 2000);
      } else {
        setError('Erro ao cancelar manutenção');
      }
    } catch (err: any) {
      console.error('Erro ao cancelar manutenção:', err);
      setError(err.response?.data?.message || 'Erro ao cancelar manutenção');
    } finally {
      setSaving(false);
    }
  };

  const handleIniciar = async () => {
    if (!manutencao) return;
    
    try {
      setSaving(true);
      const response = await axios.post(`${API_URL}/maquinas/${manutencao.maquinaId}/manutencoes`, {
        manutencaoId: parseInt(id)
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        await carregarManutencao();
      } else {
        setError('Erro ao iniciar manutenção');
      }
    } catch (err: any) {
      console.error('Erro ao iniciar manutenção:', err);
      setError(err.response?.data?.message || 'Erro ao iniciar manutenção');
    } finally {
      setSaving(false);
    }
  };

  const handleFinalizar = async () => {
    if (!manutencao) return;
    
    try {
      setSaving(true);
      const response = await axios.patch(`${API_URL}/maquinas/${manutencao.maquinaId}/manutencoes/finalizar`, {
        manutencaoId: parseInt(id)
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        await carregarManutencao();
      } else {
        setError('Erro ao finalizar manutenção');
      }
    } catch (err: any) {
      console.error('Erro ao finalizar manutenção:', err);
      setError(err.response?.data?.message || 'Erro ao finalizar manutenção');
    } finally {
      setSaving(false);
    }
  };

  const handleVoltar = () => {
    router.back();
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LoadingOverlay isLoading={loading} message="Carregando..." subMessage="Buscando dados da manutenção" />
      </Box>
    );
  }

  if (!manutencao) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Manutenção não encontrada
        </Alert>
      </Box>
    );
  }

  const duracao = calcularDuracaoManutencao(manutencao.dataInicio, manutencao.dataFim);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Editar Manutenção
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />}
          onClick={handleVoltar}
        >
          Voltar
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Operação realizada com sucesso! Redirecionando...
        </Alert>
      )}

      <LoadingOverlay isLoading={saving} message="Processando..." subMessage="Salvando alterações" />

      {/* Informações da Manutenção */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              <Build />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">{manutencao.titulo}</Typography>
              <Typography variant="body2" color="text.secondary">
                {manutencao.maquina?.nome || `Máquina ${manutencao.maquinaId}`}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip 
                label={formatarStatusManutencao(manutencao.status)}
                color={getStatusManutencaoColor(manutencao.status)}
                size="small"
              />
              <Chip 
                label={manutencao.prioridade}
                color={getPrioridadeManutencaoColor(manutencao.prioridade)}
                size="small"
              />
            </Stack>
          </Box>

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Data Agendada
              </Typography>
              <Typography variant="body1">
                {formatDateTime(manutencao.dataAgendada)}
              </Typography>
            </Grid2>
            {manutencao.dataInicio && (
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Início
                </Typography>
                <Typography variant="body1">
                  {formatDateTime(manutencao.dataInicio)}
                </Typography>
              </Grid2>
            )}
            {manutencao.dataFim && (
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Fim
                </Typography>
                <Typography variant="body1">
                  {formatDateTime(manutencao.dataFim)}
                </Typography>
              </Grid2>
            )}
            {duracao !== '-' && (
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Duração
                </Typography>
                <Typography variant="body1">
                  {duracao}
                </Typography>
              </Grid2>
            )}
          </Grid2>
        </CardContent>
      </Card>

      {/* Formulário de Edição */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Título da Manutenção"
                  value={formData.titulo}
                  onChange={handleInputChange('titulo')}
                  required
                  disabled={saving}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth required disabled={saving}>
                  <InputLabel>Prioridade</InputLabel>
                  <Select
                    value={formData.prioridade}
                    label="Prioridade"
                    onChange={handleInputChange('prioridade')}
                  >
                    <MenuItem value="BAIXA">Baixa</MenuItem>
                    <MenuItem value="MEDIA">Média</MenuItem>
                    <MenuItem value="ALTA">Alta</MenuItem>
                    <MenuItem value="URGENTE">Urgente</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Descrição"
                  multiline
                  rows={4}
                  value={formData.descricao}
                  onChange={handleInputChange('descricao')}
                  required
                  disabled={saving}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Data e Hora Agendada"
                  type="datetime-local"
                  value={formData.dataAgendada}
                  onChange={handleInputChange('dataAgendada')}
                  required
                  disabled={saving || manutencao.status !== 'AGENDADA'}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Técnico Responsável"
                  value={formData.tecnicoResponsavel}
                  onChange={handleInputChange('tecnicoResponsavel')}
                  disabled={saving}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Observações"
                  multiline
                  rows={3}
                  value={formData.observacoes}
                  onChange={handleInputChange('observacoes')}
                  disabled={saving}
                />
              </Grid2>

              <Grid2 size={12}>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={2}>
                    {podeIniciarManutencao(manutencao.status) && (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PlayArrow />}
                        onClick={handleIniciar}
                        disabled={saving}
                      >
                        Iniciar Manutenção
                      </Button>
                    )}
                    {podeFinalizarManutencao(manutencao.status) && (
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<Check />}
                        onClick={handleFinalizar}
                        disabled={saving}
                      >
                        Finalizar Manutenção
                      </Button>
                    )}
                    {podeCancelarManutencao(manutencao.status) && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Close />}
                        onClick={handleCancelar}
                        disabled={saving}
                      >
                        Cancelar Manutenção
                      </Button>
                    )}
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      onClick={handleVoltar}
                      disabled={saving}
                      startIcon={<ArrowBack />}
                    >
                      Voltar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={saving}
                      startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                    >
                      {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </Stack>
                </Stack>
              </Grid2>
            </Grid2>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
