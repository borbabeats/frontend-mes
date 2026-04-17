"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Build,
  Schedule,
  Person,
  Engineering,
  CheckCircle,
  Cancel,
  Warning,
  Edit,
  Visibility,
  ExpandMore,
  Business,
} from "@mui/icons-material";
import { formatDateTime, calculateDuration } from "@/utils/dateUtils";

type StatusManutencao = "AGENDADA" | "EM_ANDAMENTO" | "CONCLUIDA" | "CANCELADA" | "ATRASADA";

interface Manutencao {
  id: number;
  tipo: string;
  descricao: string;
  dataAgendada: string;
  dataInicio?: string;
  dataFim?: string;
  custoEstimado?: number;
  custoReal?: number;
  status: StatusManutencao;
  maquina: {
    id: number;
    nome: string;
    codigo?: string;
    setor_id?: number;
  };
  responsavel?: {
    id: number;
    nome: string;
  };
}

interface ManutencaoCardProps {
  manutencao: Manutencao;
  onVerDetalhes: (id: number) => void;
  onEditar: (id: number) => void;
  onCancelar?: (manutencao: Manutencao) => void;
}

const statusColors: Record<StatusManutencao, "default" | "primary" | "secondary" | "success" | "error" | "warning" | "info"> = {
  "AGENDADA": "primary",
  "EM_ANDAMENTO": "warning",
  "CONCLUIDA": "success",
  "CANCELADA": "error",
  "ATRASADA": "error"
};

const statusLabels: Record<StatusManutencao, string> = {
  "AGENDADA": "Agendada",
  "EM_ANDAMENTO": "Em Andamento",
  "CONCLUIDA": "Concluída",
  "CANCELADA": "Cancelada",
  "ATRASADA": "Atrasada"
};

export const ManutencaoCard: React.FC<ManutencaoCardProps> = ({
  manutencao,
  onVerDetalhes,
  onEditar,
  onCancelar,
}) => {
  const getStatusIcon = (status: StatusManutencao) => {
    switch (status) {
      case 'AGENDADA': return <Schedule />;
      case 'EM_ANDAMENTO': return <Engineering />;
      case 'CONCLUIDA': return <CheckCircle />;
      case 'CANCELADA': return <Cancel />;
      case 'ATRASADA': return <Warning />;
      default: return <Build />;
    }
  };

  return (
    <Accordion
      sx={{
        mb: 1,
        '&:before': {
          display: 'none',
        },
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {getStatusIcon(manutencao.status)}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {manutencao.maquina?.nome || `Máquina #${manutencao.maquina?.id}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {manutencao.maquina?.codigo && `Código: ${manutencao.maquina.codigo}`}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Chip
              label={statusLabels[manutencao.status]}
              color={statusColors[manutencao.status]}
              size="small"
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Setor {manutencao.maquina?.setor_id || 'N/A'}
              </Typography>
            </Box>

            {manutencao.responsavel && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {manutencao.responsavel.nome}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            {manutencao.tipo}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {manutencao.descricao}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Agendada</Typography>
              <Typography variant="body2">{formatDateTime(manutencao.dataAgendada)}</Typography>
            </Box>
          </Box>

          {manutencao.dataInicio && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Engineering sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Início</Typography>
                <Typography variant="body2">{formatDateTime(manutencao.dataInicio)}</Typography>
              </Box>
            </Box>
          )}

          {manutencao.dataFim && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Conclusão</Typography>
                <Typography variant="body2">{formatDateTime(manutencao.dataFim)}</Typography>
              </Box>
            </Box>
          )}

          {manutencao.dataInicio && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Build sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Duração</Typography>
                <Typography variant="body2">{calculateDuration(manutencao.dataInicio, manutencao.dataFim)}</Typography>
              </Box>
            </Box>
          )}
        </Box>

        {(manutencao.custoEstimado || manutencao.custoReal) && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Custos:</strong>
            </Typography>
            {manutencao.custoEstimado && (
              <Typography variant="body2" sx={{ ml: 1 }}>
                Estimado: R$ {manutencao.custoEstimado.toFixed(2)}
              </Typography>
            )}
            {manutencao.custoReal && (
              <Typography
                variant="body2"
                sx={{
                  ml: 1,
                  color: manutencao.custoReal > (manutencao.custoEstimado || 0) ? 'error.main' : 'success.main'
                }}
              >
                Real: R$ {manutencao.custoReal.toFixed(2)}
              </Typography>
            )}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => onVerDetalhes(manutencao.id)}
          >
            Ver Detalhes
          </Button>
          {(manutencao.status === 'AGENDADA' || manutencao.status === 'EM_ANDAMENTO') && (
            <Button
              size="small"
              variant="contained"
              startIcon={<Edit />}
              onClick={() => onEditar(manutencao.id)}
            >
              Editar
            </Button>
          )}
          {manutencao.status === 'AGENDADA' && onCancelar && (
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => onCancelar(manutencao)}
            >
              Cancelar
            </Button>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
