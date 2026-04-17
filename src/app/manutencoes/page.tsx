"use client";

import { useDataGrid } from "@refinedev/mui";
import { useList } from "@refinedev/core";
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Grid2,
  Box,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextareaAutosize
} from "@mui/material";
import { 
  Build, 
  Schedule, 
  Person, 
  Search,
  Add,
  Cancel,
  Warning,
  CheckCircle,
  Engineering
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { formatDateTime, calculateDuration } from "@/utils/dateUtils";
import { useState, useCallback, useRef } from 'react';
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { ManutencaoCard } from "@/components/manutencoes/ManutencaoCard";
import type { CrudFilter, LogicalFilter } from "@refinedev/core";

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
  observacoes?: string;
  status: StatusManutencao;
  maquina: {
    id: number;
    nome: string;
    codigo?: string;
  };
  responsavel?: {
    id: number;
    nome: string;
  };
  historico?: Array<{
    id: number;
    statusAnterior: string;
    novoStatus: string;
    dataRegistro: string;
    descricao: string;
    responsavel: {
      nome: string;
    };
  }>;
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

export default function ManutencoesPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusManutencao | ''>('');
    const [maquinaFilter, setMaquinaFilter] = useState('');
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedManutencao, setSelectedManutencao] = useState<Manutencao | null>(null);
    const [cancelMotivo, setCancelMotivo] = useState('');
    
    const { dataGridProps, filters, setFilters } = useDataGrid({
        resource: 'manutencoes',
        pagination: {
            mode: 'server',
            pageSize: 9,
        },
        filters: {
            mode: 'server',
        },
        syncWithLocation: true,
    });

    const isLoading = dataGridProps.loading || false;

    // Buscar máquinas para o filtro
    const { result: { data: maquinasData } } = useList({
        resource: 'maquinas',
        pagination: {
            mode: 'off',
        },
    });
    
    let rows: Manutencao[] = [];
    
    if (dataGridProps.rows && typeof dataGridProps.rows === 'object' && 'data' in dataGridProps.rows) {
      rows = Array.isArray(dataGridProps.rows.data) ? dataGridProps.rows.data : [];
    } else if (Array.isArray(dataGridProps.rows)) {
      rows = dataGridProps.rows;
    }
    
    const handleStatusChange = (status: StatusManutencao | '') => {
        setStatusFilter(status);
        
        const newFilters = [];
        
        if (status) {
            newFilters.push({
                field: 'status',
                operator: 'eq' as const,
                value: status,
            });
        }
        
        if (maquinaFilter) {
            newFilters.push({
                field: 'maquinaId',
                operator: 'eq' as const,
                value: maquinaFilter,
            });
        }
        
        if (searchTerm.trim()) {
            newFilters.push({
                field: 'search',
                operator: 'contains' as const,
                value: searchTerm.trim()
            });
        }
        
        setFilters(newFilters.length > 0 ? newFilters : []);
    };
    
    const handleMaquinaChange = (maquinaId: string) => {
        setMaquinaFilter(maquinaId);
        
        const newFilters = [];
        
        if (statusFilter) {
            newFilters.push({
                field: 'status',
                operator: 'eq' as const,
                value: statusFilter,
            });
        }
        
        if (maquinaId) {
            newFilters.push({
                field: 'maquinaId',
                operator: 'eq' as const,
                value: maquinaId,
            });
        }
        
        if (searchTerm.trim()) {
            newFilters.push({
                field: 'search',
                operator: 'contains' as const,
                value: searchTerm.trim()
            });
        }
        
        setFilters(newFilters.length > 0 ? newFilters : []);
    };
    
    const handleVerDetalhes = (id: number) => {
        router.push(`/manutencoes/detalhes/${id}`);
    };

    const handleEditar = (id: number) => {
        router.push(`/manutencoes/editar/${id}`);
    };

    const handleCancelar = (manutencao: Manutencao) => {
        setSelectedManutencao(manutencao);
        setCancelDialogOpen(true);
    };

    const confirmarCancelamento = async () => {
        if (!selectedManutencao || !cancelMotivo.trim()) return;
        
        try {
            // Aqui você faria a chamada à API para cancelar
            // await MESService.manutencao.cancelar(selectedManutencao.id, cancelMotivo);
            
            alert('Manutenção cancelada com sucesso!');
            setCancelDialogOpen(false);
            setCancelMotivo('');
            setSelectedManutencao(null);
            window.location.reload();
        } catch (error) {
            console.error('Erro ao cancelar manutenção:', error);
            alert(`Erro ao cancelar manutenção: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
    };
    
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        
        debounceTimerRef.current = setTimeout(() => {
            const newFilters = [];
            
            if (statusFilter) {
                newFilters.push({
                    field: 'status',
                    operator: 'eq' as const,
                    value: statusFilter,
                });
            }
            
            if (maquinaFilter) {
                newFilters.push({
                    field: 'maquinaId',
                    operator: 'eq' as const,
                    value: maquinaFilter,
                });
            }
            
            if (value.trim()) {
                newFilters.push({
                    field: 'search',
                    operator: 'contains' as const,
                    value: value.trim()
                });
            }
            
            setFilters(newFilters.length > 0 ? newFilters : []);
        }, 500);
    };
    
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
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Manutenções
            </Typography>
            
            <Box sx={{ mb: 3 }}>
                <Grid2 container spacing={2} alignItems="center">
                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            value={searchTerm}
                            placeholder="Buscar por descrição, máquina ou responsável..."
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={handleSearchChange}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel id="status-filter-label">Status</InputLabel>
                            <Select
                                labelId="status-filter-label"
                                label="Status"
                                value={statusFilter}
                                onChange={(e) => handleStatusChange(e.target.value as StatusManutencao | '')}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {(Object.keys(statusLabels) as StatusManutencao[]).map(status => (
                                    <MenuItem key={status} value={status}>
                                        {statusLabels[status]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel id="maquina-filter-label">Máquina</InputLabel>
                            <Select
                                labelId="maquina-filter-label"
                                label="Máquina"
                                value={maquinaFilter}
                                onChange={(e) => handleMaquinaChange(e.target.value)}
                            >
                                <MenuItem value="">Todas</MenuItem>
                                {maquinasData?.map((maquina: any) => (
                                    <MenuItem key={maquina.id} value={maquina.id}>
                                        {maquina.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => router.push('/manutencoes/criar')}
                            fullWidth
                        >
                            Agendar Manutenção
                        </Button>
                    </Grid2>
                </Grid2>
            </Box>
            
            <LoadingOverlay 
                isLoading={isLoading}
                message="Carregando..."
                subMessage="Buscando dados da API"
            />
            
            <Box sx={{ width: '100%' }}>
                {rows.map((manutencao: Manutencao) => (
                    <ManutencaoCard
                        key={manutencao.id}
                        manutencao={manutencao}
                        onVerDetalhes={handleVerDetalhes}
                        onEditar={handleEditar}
                        onCancelar={handleCancelar}
                    />
                ))}
            </Box>

            <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Cancelar Manutenção</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Tem certeza que deseja cancelar esta manutenção?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {selectedManutencao?.tipo} - {selectedManutencao?.maquina?.nome}
                    </Typography>
                    <TextField
                        fullWidth
                        label="Motivo do cancelamento"
                        multiline
                        rows={3}
                        value={cancelMotivo}
                        onChange={(e) => setCancelMotivo(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialogOpen(false)}>
                        Voltar
                    </Button>
                    <Button 
                        onClick={confirmarCancelamento}
                        variant="contained"
                        color="error"
                        disabled={!cancelMotivo.trim()}
                    >
                        Confirmar Cancelamento
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
