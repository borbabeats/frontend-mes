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
import { useSession } from 'next-auth/react';
import { ProductionQuantityLimits, ErrorOutline, CheckCircle } from '@mui/icons-material';
import { MESService } from '@/services/mesService';

interface FinalizeApontamentoButtonProps {
  apontamentoId: number | string;
  onSuccess?: () => void;
}

export default function FinalizeApontamentoButton({
  apontamentoId,
  onSuccess
}: FinalizeApontamentoButtonProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [quantidadeProduzida, setQuantidadeProduzida] = useState('');
  const [quantidadeDefeito, setQuantidadeDefeito] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => {
    setOpen(true);
    setError(null);
    setQuantidadeProduzida('');
    setQuantidadeDefeito('');
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleSubmit = async () => {
    const quantidade = Number(quantidadeProduzida);
    const defeitos = Number(quantidadeDefeito);

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

    if (quantidade === 0) {
      setError('Quantidade produzida deve ser maior que zero para finalizar');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await MESService.apontamento.finalizar(apontamentoId, quantidade, defeitos);
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao finalizar apontamento:', error);
      setError(error instanceof Error ? error.message : 'Erro ao finalizar apontamento');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantidadeChange = (value: string) => {
    // Permitir apenas números
    const numValue = value.replace(/[^0-9]/g, '');
    setQuantidadeProduzida(numValue);
  };

  const handleDefeitosChange = (value: string) => {
    // Permitir apenas números
    const numValue = value.replace(/[^0-9]/g, '');
    setQuantidadeDefeito(numValue);
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        size="small"
        startIcon={<CheckCircle />}
        onClick={handleOpen}
      >
        Finalizar Apontamento
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Finalizar Apontamento
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              ID do Apontamento: <strong>{apontamentoId}</strong>
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              Ao finalizar o apontamento, os dados de produção serão registrados e o apontamento será encerrado.
            </Alert>
          </Box>

          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Quantidade Produzida *"
                type="text"
                value={quantidadeProduzida}
                onChange={(e) => handleQuantidadeChange(e.target.value)}
                InputProps={{
                  startAdornment: <ProductionQuantityLimits sx={{ mr: 1, color: 'action.active' }} />
                }}
                helperText="Total de unidades produzidas neste apontamento"
                required
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Quantidade com Defeito"
                type="text"
                value={quantidadeDefeito}
                onChange={(e) => handleDefeitosChange(e.target.value)}
                InputProps={{
                  startAdornment: <ErrorOutline sx={{ mr: 1, color: 'action.active' }} />
                }}
                helperText="Unidades com defeito (padrão: 0)"
              />
            </Grid2>
          </Grid2>

          {Number(quantidadeDefeito) > Number(quantidadeProduzida) && Number(quantidadeProduzida) > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Quantidade de defeitos ({quantidadeDefeito}) é maior que a quantidade produzida ({quantidadeProduzida}).
            </Alert>
          )}

          {Number(quantidadeProduzida) > 0 && Number(quantidadeDefeito) > 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Taxa de defeito: {((Number(quantidadeDefeito) / Number(quantidadeProduzida)) * 100).toFixed(2)}%
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
            color="success"
            disabled={loading || !quantidadeProduzida || Number(quantidadeProduzida) <= 0}
          >
            {loading ? <CircularProgress size={20} /> : 'Finalizar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
