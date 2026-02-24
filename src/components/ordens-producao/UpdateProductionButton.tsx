'use client';

import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid2
} from '@mui/material';
import { ProductionQuantityLimits, ErrorOutline } from '@mui/icons-material';
import { MESService } from '@/services/mesService';

interface UpdateProductionButtonProps {
  ordemId: number | string;
  quantidadeProduzida: number;
  quantidadeDefeitos: number;
  onSuccess?: () => void;
}

export default function UpdateProductionButton({
  ordemId,
  quantidadeProduzida,
  quantidadeDefeitos,
  onSuccess
}: UpdateProductionButtonProps) {
  const [open, setOpen] = useState(false);
  const [novaQuantidade, setNovaQuantidade] = useState(quantidadeProduzida.toString());
  const [novosDefeitos, setNovosDefeitos] = useState(quantidadeDefeitos.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => {
    setOpen(true);
    setError(null);
    setNovaQuantidade(quantidadeProduzida.toString());
    setNovosDefeitos(quantidadeDefeitos.toString());
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleSubmit = async () => {
    const quantidade = Number(novaQuantidade);
    const defeitos = Number(novosDefeitos);

    // Validações
    if (isNaN(quantidade) || quantidade < 0) {
      setError('Quantidade produzida deve ser um número válido e não negativo');
      return;
    }

    if (isNaN(defeitos) || defeitos < 0) {
      setError('Quantidade de defeitos deve ser um número válido e não negativo');
      return;
    }

    if (defeitos > quantidade) {
      setError('Quantidade de defeitos não pode ser maior que a quantidade produzida');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await MESService.ordemProducao.atualizarProducao(ordemId, quantidade, defeitos);
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao atualizar produção:', error);
      setError(error instanceof Error ? error.message : 'Erro ao atualizar produção');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantidadeChange = (value: string) => {
    // Permitir apenas números
    const numValue = value.replace(/[^0-9]/g, '');
    setNovaQuantidade(numValue);
  };

  const handleDefeitosChange = (value: string) => {
    // Permitir apenas números
    const numValue = value.replace(/[^0-9]/g, '');
    setNovosDefeitos(numValue);
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<ProductionQuantityLimits />}
        onClick={handleOpen}
      >
        Atualizar Produção
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Atualizar Produção da OP
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Valores Atuais:
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2>
                <Typography variant="body2">
                  Produzida: <strong>{quantidadeProduzida}</strong>
                </Typography>
              </Grid2>
              <Grid2>
                <Typography variant="body2">
                  Defeitos: <strong>{quantidadeDefeitos}</strong>
                </Typography>
              </Grid2>
            </Grid2>
          </Box>

          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Quantidade Produzida"
                type="text"
                value={novaQuantidade}
                onChange={(e) => handleQuantidadeChange(e.target.value)}
                InputProps={{
                  startAdornment: <ProductionQuantityLimits sx={{ mr: 1, color: 'action.active' }} />
                }}
                helperText="Total de unidades produzidas"
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Quantidade com Defeito"
                type="text"
                value={novosDefeitos}
                onChange={(e) => handleDefeitosChange(e.target.value)}
                InputProps={{
                  startAdornment: <ErrorOutline sx={{ mr: 1, color: 'action.active' }} />
                }}
                helperText="Unidades com defeito"
              />
            </Grid2>
          </Grid2>

          {Number(novosDefeitos) > Number(novaQuantidade) && Number(novaQuantidade) > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Quantidade de defeitos ({novosDefeitos}) é maior que a quantidade produzida ({novaQuantidade}).
            </Alert>
          )}

          {Number(novaQuantidade) < Number(quantidadeProduzida) && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Você está reduzindo a quantidade produzida. Isso pode afetar o progresso da OP.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading || !novaQuantidade || Number(novaQuantidade) < 0}
          >
            {loading ? <CircularProgress size={20} /> : 'Atualizar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
