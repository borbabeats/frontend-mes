'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid2,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useList, useOne } from '@refinedev/core';
import { createOrdemProducaoSchema, UpdateOrdemProducaoFormData } from '@/validations/ordemProducao';

interface UpdateOrdemProducaoData {
  codigo: string;
  produto: string;
  descricao?: string;
  quantidadePlanejada: number;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  dataInicioPlanejado: string;
  dataFimPlanejado: string;
  setorId: number;
  responsavelId?: number;
  origemTipo?: 'PEDIDO_VENDA' | 'REPOSICAO_ESTOQUE' | 'PLANO_MESTRE_PRODUCAO' | 'DEMANDA_INTERNA' | 'PREVISAO_VENDAS';
  origemId?: string;
  observacoes?: string;
}

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
  setorId: number;
  responsavelId?: number;
  origemTipo?: string;
  origemId?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EditarOrdemProducaoPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const id = params.id as string;

  // Buscar dados da OP
  const { query, isLoading: ordemLoading } = useOne<OrdemProducao>({
    resource: 'ordens-producao',
    id: id,
  });

  const ordemData = query?.data;

  // Buscar setores e usuários para os selects
  const { result: { data: setoresData } } = useList({
    resource: 'setores',
    pagination: { mode: 'off' }
  });

  const { result: { data: usuariosData } } = useList({
    resource: 'usuarios',
    pagination: { mode: 'off' }
  });

  // Estado do formulário
  const [formData, setFormData] = useState<UpdateOrdemProducaoData>({
    codigo: '',
    produto: '',
    descricao: '',
    quantidadePlanejada: 0,
    prioridade: 'MEDIA',
    dataInicioPlanejado: '',
    dataFimPlanejado: '',
    setorId: 0,
    responsavelId: session?.user?.id ? Number(session.user.id) : undefined,
    origemTipo: 'DEMANDA_INTERNA',
    origemId: '',
    observacoes: ''
  });

  // Preencher formulário quando os dados da OP forem carregados
  useEffect(() => {
    if (ordemData?.data) {
      const ordem = ordemData.data;
      setFormData({
        codigo: ordem.codigo,
        produto: ordem.produto,
        descricao: ordem.descricao || '',
        quantidadePlanejada: ordem.quantidadePlanejada,
        prioridade: ordem.prioridade as any,
        dataInicioPlanejado: ordem.dataInicioPlanejado,
        dataFimPlanejado: ordem.dataFimPlanejado,
        setorId: ordem.setorId,
        responsavelId: ordem.responsavelId || undefined,
        origemTipo: ordem.origemTipo as any || 'DEMANDA_INTERNA',
        origemId: ordem.origemId || '',
        observacoes: ordem.observacoes || ''
      });
      setLoading(false);
    }
  }, [ordemData]);

  useEffect(() => {
    if (ordemLoading) {
      setError('Erro ao carregar dados da ordem de produção');
      setLoading(false);
    }
  }, [ordemLoading]);

  const handleInputChange = (field: keyof UpdateOrdemProducaoData, value: string | number) => {
    // Converter para número se for o campo responsavelId
    const processedValue = field === 'responsavelId' && value !== '' ? Number(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));
    setError(null);
  };

  const validateForm = (): string | null => {
    const result = createOrdemProducaoSchema.safeParse(formData);
    
    if (!result.success) {
      // Retornar o primeiro erro encontrado
      if (result.error.issues.length > 0) {
        return result.error.issues[0].message;
      }
      return 'Erro de validação do formulário';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Preparar payload apenas com campos preenchidos
      const payload: Partial<UpdateOrdemProducaoData> = {
        codigo: formData.codigo,
        produto: formData.produto,
        quantidadePlanejada: formData.quantidadePlanejada,
        prioridade: formData.prioridade,
        dataInicioPlanejado: formData.dataInicioPlanejado,
        dataFimPlanejado: formData.dataFimPlanejado,
        setorId: formData.setorId
      };

      // Adicionar campos opcionais apenas se preenchidos
      if (formData.descricao?.trim()) payload.descricao = formData.descricao;
      if (formData.responsavelId && formData.responsavelId > 0) payload.responsavelId = formData.responsavelId;
      if (formData.origemTipo) payload.origemTipo = formData.origemTipo;
      if (formData.origemId?.trim()) payload.origemId = formData.origemId;
      if (formData.observacoes?.trim()) payload.observacoes = formData.observacoes;

      console.log('Enviando payload para atualização:', payload);

      const response = await fetch(`${API_URL}/ordens-producao/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('OP atualizada com sucesso:', result);
        setSuccess(true);
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          router.push('/ordens-producao');
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar OP:', error);
      setError(error instanceof Error ? error.message : 'Erro ao atualizar ordem de produção');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoltar = () => {
    router.back();
  };

  if (loading || ordemLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!ordemData?.data) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error || 'Ordem de produção não encontrada'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleVoltar}
          sx={{ mt: 2 }}
        >
          Voltar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Stack spacing={3}>
        {/* Cabeçalho */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleVoltar}
          >
            Voltar
          </Button>
          <Typography variant="h4" component="h1">
            Editar Ordem de Produção
          </Typography>
        </Box>

        {/* Informações da OP */}
        <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Typography variant="body2" color="text.secondary">
            OP: {ordemData?.data?.codigo} | Status: {ordemData?.data?.status?.replace('_', ' ')} | 
            Produzido: {ordemData?.data?.quantidadeProduzida} / {ordemData?.data?.quantidadePlanejada}
          </Typography>
        </Paper>

        {/* Alertas */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success">
            Ordem de produção atualizada com sucesso! Redirecionando...
          </Alert>
        )}

        {/* Formulário */}
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={3}>
              {/* Campos obrigatórios */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Código da OP"
                  value={formData.codigo}
                  onChange={(e) => handleInputChange('codigo', e.target.value)}
                  placeholder="Ex: OP-2026-0001"
                  required
                  disabled={isSubmitting}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Produto"
                  value={formData.produto}
                  onChange={(e) => handleInputChange('produto', e.target.value)}
                  placeholder="Ex: Eixo Forjado X"
                  required
                  disabled={isSubmitting}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Descrição"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  placeholder="Lote para atender pedido PV-12345"
                  multiline
                  rows={2}
                  disabled={isSubmitting}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Quantidade Planejada"
                  type="number"
                  value={formData.quantidadePlanejada}
                  onChange={(e) => handleInputChange('quantidadePlanejada', Number(e.target.value))}
                  inputProps={{ min: 1 }}
                  required
                  disabled={isSubmitting}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth required>
                  <InputLabel>Prioridade</InputLabel>
                  <Select
                    value={formData.prioridade}
                    onChange={(e) => handleInputChange('prioridade', e.target.value)}
                    disabled={isSubmitting}
                  >
                    <MenuItem value="BAIXA">Baixa</MenuItem>
                    <MenuItem value="MEDIA">Média</MenuItem>
                    <MenuItem value="ALTA">Alta</MenuItem>
                    <MenuItem value="URGENTE">Urgente</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth required>
                  <InputLabel>Setor</InputLabel>
                  <Select
                    value={formData.setorId}
                    onChange={(e) => handleInputChange('setorId', Number(e.target.value))}
                    disabled={isSubmitting}
                  >
                    {setoresData?.map((setor: any) => (
                      <MenuItem key={setor.id} value={setor.id}>
                        {setor.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Data Início Planejado"
                  type="datetime-local"
                  value={formData.dataInicioPlanejado}
                  onChange={(e) => handleInputChange('dataInicioPlanejado', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                  disabled={isSubmitting}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Data Fim Planejado"
                  type="datetime-local"
                  value={formData.dataFimPlanejado}
                  onChange={(e) => handleInputChange('dataFimPlanejado', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                  disabled={isSubmitting}
                />
              </Grid2>

              {/* Campos opcionais */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Responsável</InputLabel>
                  <Select
                    value={formData.responsavelId || ''}
                    onChange={(e) => handleInputChange('responsavelId', e.target.value)}
                    disabled={isSubmitting}
                  >
                    <MenuItem value="">Nenhum responsável</MenuItem>
                    {usuariosData?.map((usuario: any) => (
                      <MenuItem key={usuario.id} value={usuario.id}>
                        {usuario.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Origem</InputLabel>
                  <Select
                    value={formData.origemTipo || ''}
                    onChange={(e) => handleInputChange('origemTipo', e.target.value)}
                    disabled={isSubmitting}
                  >
                    <MenuItem value="">Selecione</MenuItem>
                    <MenuItem value="PEDIDO_VENDA">Pedido de Venda</MenuItem>
                    <MenuItem value="REPOSICAO_ESTOQUE">Reposição de Estoque</MenuItem>
                    <MenuItem value="PLANO_MESTRE_PRODUCAO">Plano Mestre de Produção</MenuItem>
                    <MenuItem value="DEMANDA_INTERNA">Demanda Interna</MenuItem>
                    <MenuItem value="PREVISAO_VENDAS">Previsão de Vendas</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="ID da Origem"
                  value={formData.origemId}
                  onChange={(e) => handleInputChange('origemId', e.target.value)}
                  placeholder="Ex: PV-12345"
                  disabled={isSubmitting}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Observações"
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  placeholder="Priorizar setup na máquina USINA-001"
                  multiline
                  rows={3}
                  disabled={isSubmitting}
                />
              </Grid2>

              {/* Botões */}
              <Grid2 size={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={handleVoltar}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </Stack>
              </Grid2>
            </Grid2>
          </form>
        </Paper>
      </Stack>
    </Box>
  );
}