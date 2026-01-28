'use client';

import { useDataGrid } from "@refinedev/mui";
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Grid,
  Box,
  Chip,
  Avatar
} from "@mui/material";
import { 
  Factory, 
  Schedule, 
  Person, 
  CheckCircle, 
  Error, 
  Pending 
} from "@mui/icons-material";

export default function ApontamentosPage() {
    const { dataGridProps } = useDataGrid({});

    console.log('dataGridProps ->',dataGridProps);
    
    const getStatusColor = (status: string) => {
      switch(status) {
        case 'ativo': return 'success';
        case 'parado': return 'error';
        case 'manutencao': return 'warning';
        default: return 'default';
      }
    };

    const getStatusIcon = (status: string) => {
      switch(status) {
        case 'ativo': return <CheckCircle color="success" />;
        case 'parado': return <Error color="error" />;
        case 'manutencao': return <Pending color="warning" />;
        default: return null;
      }
    };

    const getEficienciaColor = (eficiencia: number) => {
      if (eficiencia >= 80) return 'success';
      if (eficiencia >= 60) return 'warning';
      return 'error';
    };
    
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Apontamentos
            </Typography>
            
            <Grid container spacing={3}>
                {dataGridProps.rows.map((apontamento:any) => (
                    <Grid item xs={12} sm={6} md={4} key={apontamento.id}>
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
                                            Máquina ID: {apontamento.maquinaId}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            OP ID: {apontamento.opId}
                                        </Typography>
                                    </Box>
                                    <Chip 
                                        label="ATIVO"
                                        color="success"
                                        size="small"
                                    />
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Person sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                        Operador ID: {apontamento.usuarioId}
                                    </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                        Apontamento ID: {apontamento.id}
                                    </Typography>
                                </Box>
                                
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Quantidade Produzida: {apontamento.quantidadeProduzida} unidades
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ mr: 1 }}>
                                            Status:
                                        </Typography>
                                        <Chip 
                                            label="REGISTRADO"
                                            color="primary"
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                            </CardContent>
                            
                            <CardActions>
                                <Button size="small" variant="outlined">
                                    Ver Detalhes
                                </Button>
                                <Button size="small" variant="contained">
                                    Editar
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}