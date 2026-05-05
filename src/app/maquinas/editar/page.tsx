"use client";

import { useState, useEffect } from 'react';

// Configurar página como dynamic para build estático
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, authClient } from '@/lib/auth-client';
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
  Alert,
  CircularProgress,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { useOne, useList } from '@refinedev/core';

interface MaquinaData {
  nome: string;
  descricao: string;
  status: 'Disponível' | 'Em Uso' | 'Manutenção' | 'Inativa' | 'Parada' | 'Desativada';
  setorId: number;
  capacidade: number;
  unidade: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EditarMaquinaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const id = searchParams?.get('id');

  // Buscar dados da máquina
  const { query: { data: maquinaData, isLoading: maquinaLoading } } = useOne({
    resource: 'maquinas',
    id: id || '',
    queryOptions: {
      enabled: !!id,
    }
  });

  // Buscar setores para o select
  const { result: setorOptions } = useList({
    resource: 'setores',
    pagination: { mode: 'off' }
  });

  // Estado do formulário
  const [formData, setFormData] = useState<MaquinaData>({
    nome: '',
    descricao: '',
    status: 'Disponível',
    setorId: 0,
    capacidade: 0,
    unidade: 'unidade',
  });

  // Preencher formulário quando os dados da máquina forem carregados
  useEffect(() => {
    if (maquinaData?.data) {
      const maquina = maquinaData.data;
      setFormData({
        nome: maquina.nome || '',
        descricao: maquina.descricao || '',
        status: maquina.status || 'Disponível',
        setorId: maquina.setorId || 0,
        capacidade: maquina.capacidade || 0,
        unidade: maquina.unidade || 'unidade',
      });
      setLoading(false);
    }
  }, [maquinaData]);

  const handleInputChange = (field: keyof MaquinaData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      setError('ID da máquina não encontrado');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        nome: formData.nome.trim(),
        descricao: formData.descricao.trim(),
        status: formData.status,
        setorId: formData.setorId,
        capacidade: formData.capacidade,
        unidade: formData.unidade,
      };

      const response = await fetch(`${API_URL}/maquinas/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authClient.token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(true);
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          router.push('/maquinas');
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Erro ao atualizar máquina');
      }
    } catch (error) {
      console.error('Erro ao atualizar máquina:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/maquinas');
  };

  if (loading || maquinaLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!id) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          ID da máquina não encontrado. Por favor, acesse através da lista de máquinas.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1">
          Editar Máquina
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Máquina atualizada com sucesso! Redirecionando...
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Nome da Máquina"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              required
              disabled={isSubmitting}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth required disabled={isSubmitting}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <MenuItem value="Disponível">Disponível</MenuItem>
                <MenuItem value="Em Uso">Em Uso</MenuItem>
                <MenuItem value="Manutenção">Manutenção</MenuItem>
                <MenuItem value="Inativa">Inativa</MenuItem>
                <MenuItem value="Parada">Parada</MenuItem>
                <MenuItem value="Desativada">Desativada</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Descrição"
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              multiline
              rows={3}
              disabled={isSubmitting}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth required disabled={isSubmitting}>
              <InputLabel>Setor</InputLabel>
              <Select
                value={formData.setorId}
                label="Setor"
                onChange={(e) => handleInputChange('setorId', Number(e.target.value))}
              >
                {setorOptions?.data?.map((setor: any) => (
                  <MenuItem key={setor.value} value={setor.value}>
                    {setor.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Capacidade"
              type="number"
              value={formData.capacidade}
              onChange={(e) => handleInputChange('capacidade', Number(e.target.value))}
              disabled={isSubmitting}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Unidade"
              value={formData.unidade}
              onChange={(e) => handleInputChange('unidade', e.target.value)}
              disabled={isSubmitting}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleBack}
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
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
}
