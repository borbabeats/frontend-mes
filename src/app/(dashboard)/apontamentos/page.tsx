'use client';

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
  MenuItem
} from "@mui/material";

import { 
  Factory, 
  Schedule, 
  Person, 
  Search,
  Add,
  CheckCircle
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { formatDateTime, calculateDuration } from "@/utils/dateUtils";
import { useState, useCallback, useRef } from 'react';
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { MESService } from '@/services/mesService';

export default function ApontamentosPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    
    const { dataGridProps, search, filters, setFilters } = useDataGrid({
        resource: 'apontamentos',
        pagination: {
            mode: 'server',
            pageSize: 9,
        },
        filters: {
            mode: 'server',
        },
        syncWithLocation: true,
    });

    // Verificar estado de loading
    const isLoading = dataGridProps.loading || false;

    // Buscar setores para o filtro
    const { result: { data: setoresData } } = useList({
        resource: 'setores',
        pagination: {
            mode: 'off',
        },
    });
    
    // Os dados podem estar em dataGridProps.rows.data ou diretamente em dataGridProps.rows
    let rows: any[] = [];
    
    if (dataGridProps.rows && typeof dataGridProps.rows === 'object' && 'data' in dataGridProps.rows) {
      rows = Array.isArray(dataGridProps.rows.data) ? dataGridProps.rows.data : [];
    } else if (Array.isArray(dataGridProps.rows)) {
      rows = dataGridProps.rows;
    }
    
    const handleSetorChange = (setorId: string) => {
        if (setorId === '') {
            // Remover filtro de setor
            setFilters([]);
        } else {
            // Adicionar filtro de setor
            setFilters([{
                field: 'setorId',
                operator: 'eq',
                value: setorId,
            }]);
        }
    };
    
    const handleVerDetalhes = (id: number) => {
        router.push(`/apontamentos/detalhes/${id}`);
    };

    const handleEditar = (id: number) => {
        router.push(`/apontamentos/editar/${id}`);
    };

    const handleFinalizar = async (id: number) => {
        try {
            // Obter o apontamento atual para pegar as quantidades
            const apontamento = rows.find(a => a.id === id);
            
            await MESService.apontamento.finalizar(
                id,
                apontamento?.quantidadeProduzida || 0,
                apontamento?.quantidadeDefeito || 0
            );
            
            alert('Apontamento finalizado com sucesso!');
            // Recarregar a página para atualizar a lista
            window.location.reload();
        } catch (error) {
            console.error('Erro ao finalizar apontamento:', error);
            alert(`Erro ao finalizar apontamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
    };
    
    // Ref para armazenar o timer do debounce
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        // Limpar timer anterior
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        
        // Configurar novo timer
        debounceTimerRef.current = setTimeout(() => {
            if (value.trim()) {
                // Adicionar filtro de busca
                setFilters([{
                    field: 'search',
                    operator: 'contains',
                    value: value.trim()
                }]);
            } else {
                // Limpar todos os filtros se busca estiver vazia
                setFilters([]);
            }
        }, 500); // 500ms de delay
    };
    
    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // Limpar timer e fazer busca imediata
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            if (searchTerm.trim()) {
                setFilters([{
                    field: 'search',
                    operator: 'contains',
                    value: searchTerm.trim()
                }]);
            } else {
                setFilters([]);
            }
        }
    };
    
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Apontamentos
            </Typography>
            
            <Box sx={{ mb: 3 }}>
                <Grid2 container spacing={2} alignItems="center">
                    <Grid2 size={{ xs: 12, md: 8 }}>
                        <TextField
                            fullWidth
                            value={searchTerm}
                            placeholder="Buscar por OP, máquina, operador ou produto..."
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={handleSearchChange}
                            onKeyPress={handleSearchKeyPress}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth>
                            <InputLabel id="setor-filter-label">Filtrar por Setor</InputLabel>
                            <Select
                                labelId="setor-filter-label"
                                label="Filtrar por Setor"
                                value={filters?.[0]?.value || ''}
                                onChange={(e) => handleSetorChange(e.target.value)}
                            >
                                <MenuItem value="">Todos os setores</MenuItem>
                                {setoresData?.map((setor: any) => (
                                    <MenuItem key={setor.id} value={setor.id}>
                                        {setor.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid2>
                </Grid2>
            </Box>
            
            <LoadingOverlay 
                isLoading={isLoading}
                message="Carregando..."
                subMessage="Buscando dados da API"
            />
            
            <Grid2 container spacing={3}>
                {rows.map((apontamento:any) => (
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={apontamento.id}>
                        <Card 
                            sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4
                                }
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                        <Factory />
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="div">
                                            {apontamento.op?.codigo || `OP #${apontamento.opId}`}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {apontamento.maquina?.nome || `Máquina #${apontamento.maquinaId}`}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {apontamento.op?.produto || 'Produto não informado'}
                                        </Typography>
                                    </Box>
                                    <Chip 
                                        label={apontamento.dataFim ? "CONCLUÍDO" : "EM ANDAMENTO"}
                                        color={apontamento.dataFim ? "success" : "warning"}
                                        size="small"
                                    />
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Person sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                        {apontamento.usuario?.nome || `Operador #${apontamento.usuarioId}`}
                                    </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                        Início: {formatDateTime(apontamento.dataInicio)}
                                    </Typography>
                                </Box>
                                
                                {apontamento.dataFim && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body2">
                                            Fim: {formatDateTime(apontamento.dataFim)}
                                        </Typography>
                                    </Box>
                                )}
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
                                        Duração:
                                    </Typography>
                                    <Typography variant="body2">
                                        {calculateDuration(apontamento.dataInicio, apontamento.dataFim)}
                                    </Typography>
                                </Box>
                                
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Produção: {apontamento.quantidadeProduzida} unidades
                                    </Typography>
                                    {apontamento.quantidadeDefeito > 0 && (
                                        <Typography variant="body2" color="error" gutterBottom>
                                            Defeitos: {apontamento.quantidadeDefeito} unidades
                                        </Typography>
                                    )}
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ mr: 1 }}>
                                            Qualidade:
                                        </Typography>
                                        <Chip 
                                            label={`${Math.round(((apontamento.quantidadeProduzida - apontamento.quantidadeDefeito) / apontamento.quantidadeProduzida) * 100)}%`}
                                            color={apontamento.quantidadeDefeito === 0 ? "success" : "warning"}
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                            </CardContent>
                            
                            <CardActions>
                                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                    <Button 
                                        size="small" 
                                        variant="outlined"
                                        onClick={() => handleVerDetalhes(apontamento.id)}
                                    >
                                        Ver Detalhes
                                    </Button>
                                    <Button 
                                        size="small"
                                        variant="contained"
                                        onClick={() => handleEditar(apontamento.id)}
                                    >
                                        Editar
                                    </Button>
                                </Box>
                                {!apontamento.dataFim && (
                                    <Box sx={{ display: 'flex', justifyContent: 'stretch' }}>
                                        <Button 
                                            size="small"
                                            variant="contained"
                                            color="success"
                                            startIcon={<CheckCircle />}
                                            onClick={() => handleFinalizar(apontamento.id)}
                                            fullWidth
                                        >
                                            Finalizar
                                        </Button>
                                    </Box>
                                )}
                            </CardActions>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>
        </Box>
    );
}