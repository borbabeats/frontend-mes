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
  Chip,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { 
  StatusOP, 
  formatarStatusOP, 
  getStatusOPColor, 
  verificarTransicaoPermitida, 
  getStatusPossiveis 
} from '@/utils/ordemProducaoStatus';
import { MESService } from '@/services/mesService';

interface StatusChangeButtonProps {
  ordemId: number | string;
  statusAtual: StatusOP;
  quantidadeProduzida: number;
  quantidadePlanejada: number;
  onSuccess?: () => void;
}

export default function StatusChangeButton({
  ordemId,
  statusAtual,
  quantidadeProduzida,
  quantidadePlanejada,
  onSuccess
}: StatusChangeButtonProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [novoStatus, setNovoStatus] = useState<StatusOP | ''>('');
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userRole = session?.user?.role as any;
  const statusPossiveis = getStatusPossiveis(statusAtual, userRole);

  const handleOpen = () => {
    setOpen(true);
    setError(null);
    setMotivo('');
    setNovoStatus('');
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
    setMotivo('');
    setNovoStatus('');
  };

  const handleSubmit = async () => {
    if (!novoStatus) {
      setError('Selecione um novo status');
      return;
    }

    if (!motivo.trim()) {
      setError('O motivo é obrigatório');
      return;
    }

    const verificacao = verificarTransicaoPermitida(statusAtual, novoStatus, userRole);
    if (!verificacao.permitida) {
      setError(verificacao.motivo || 'Transição não permitida');
      return;
    }

    // Verificar regra especial para FINALIZADA
    if (novoStatus === 'FINALIZADA' && quantidadeProduzida < quantidadePlanejada) {
      setError('Não é possível finalizar OP: quantidade produzida é menor que a planejada');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await MESService.ordemProducao.alterarStatus(ordemId, novoStatus, motivo.trim());
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      setError(error instanceof Error ? error.message : 'Erro ao alterar status');
    } finally {
      setLoading(false);
    }
  };

  // Se não há status possíveis, não mostrar o botão
  if (statusPossiveis.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={handleOpen}
        disabled={statusPossiveis.length === 0}
      >
        Alterar Status
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Alterar Status da OP
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Status Atual:
            </Typography>
            <Chip 
              label={formatarStatusOP(statusAtual)}
              color={getStatusOPColor(statusAtual)}
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Novo Status</InputLabel>
            <Select
              value={novoStatus}
              label="Novo Status"
              onChange={(e) => setNovoStatus(e.target.value as StatusOP)}
            >
              <MenuItem value="">Selecione...</MenuItem>
              {statusPossiveis.map((status) => (
                <MenuItem key={status} value={status}>
                  {formatarStatusOP(status)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Motivo da Alteração"
            multiline
            rows={3}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Descreva o motivo da alteração de status..."
            required
          />

          {novoStatus === 'FINALIZADA' && quantidadeProduzida < quantidadePlanejada && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Quantidade produzida ({quantidadeProduzida}) é menor que a planejada ({quantidadePlanejada}). 
              A OP não pode ser finalizada.
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
            disabled={loading || !novoStatus || !motivo.trim()}
          >
            {loading ? <CircularProgress size={20} /> : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
