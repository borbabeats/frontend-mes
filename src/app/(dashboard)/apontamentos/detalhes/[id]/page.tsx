"use client";

import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import { Stack, Box, Typography, Chip, Grid2, Card, CardContent } from "@mui/material";
import { Factory, Schedule, Person } from "@mui/icons-material";
import { formatDateTime, calculateDuration } from "@utils/dateUtils";

export default function ApontamentosShow() {
    const { query } = useShow({});
    const { data, isLoading } = query;
    
    const record = data?.data;
    
    return (
        <Show isLoading={isLoading}>
            <Stack gap={3}>
                {/* Header com informações principais */}
                <Box>
                    <Typography variant="h4" gutterBottom>
                        {record?.op?.codigo || `OP #${record?.opId}`}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        {record?.op?.produto || 'Produto não informado'}
                    </Typography>
                    <Chip 
                        label={record?.dataFim ? "CONCLUÍDO" : "EM ANDAMENTO"}
                        color={record?.dataFim ? "success" : "warning"}
                        size="medium"
                        sx={{ mt: 1 }}
                    />
                </Box>

                {/* Informações detalhadas em cards */}
                <Grid2 container spacing={3}>
                    {/* Informações da Máquina */}
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Factory sx={{ mr: 1 }} />
                                    Máquina
                                </Typography>
                                <Stack gap={2}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">Código</Typography>
                                        <TextField value={record?.maquina?.codigo || `Máquina #${record?.maquinaId}`} />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">Nome</Typography>
                                        <TextField value={record?.maquina?.nome || 'Não informado'} />
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid2>

                    {/* Informações do Operador */}
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Person sx={{ mr: 1 }} />
                                    Operador
                                </Typography>
                                <Stack gap={2}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">Nome</Typography>
                                        <TextField value={record?.usuario?.nome || `Operador #${record?.usuarioId}`} />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">Email</Typography>
                                        <TextField value={record?.usuario?.email || 'Não informado'} />
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid2>

                    {/* Informações de Tempo */}
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Schedule sx={{ mr: 1 }} />
                                    Tempo
                                </Typography>
                                <Stack gap={2}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">Início</Typography>
                                        <TextField value={formatDateTime(record?.dataInicio)} />
                                    </Box>
                                    {record?.dataFim && (
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Fim</Typography>
                                            <TextField value={formatDateTime(record?.dataFim)} />
                                        </Box>
                                    )}
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">Duração</Typography>
                                        <TextField value={calculateDuration(record?.dataInicio, record?.dataFim)} />
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid2>

                    {/* Informações de Produção */}
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Produção
                                </Typography>
                                <Stack gap={2}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">Quantidade Produzida</Typography>
                                        <TextField value={`${record?.quantidadeProduzida} unidades`} />
                                    </Box>
                                    {record?.quantidadeDefeito > 0 && (
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Quantidade com Defeito</Typography>
                                            <TextField value={`${record?.quantidadeDefeito} unidades`} />
                                        </Box>
                                    )}
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">Taxa de Qualidade</Typography>
                                        <TextField 
                                            value={`${Math.round(((record?.quantidadeProduzida - record?.quantidadeDefeito) / record?.quantidadeProduzida) * 100)}%`}
                                        />
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid2>

                    {/* Informações da OP */}
                    <Grid2 size={{ xs: 12 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Ordem de Produção
                                </Typography>
                                <Grid2 container spacing={2}>
                                    <Grid2 size={{ xs: 12, md: 3 }}>
                                        <Typography variant="body2" color="text.secondary">Código</Typography>
                                        <TextField value={record?.op?.codigo || `OP #${record?.opId}`} />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, md: 3 }}>
                                        <Typography variant="body2" color="text.secondary">Produto</Typography>
                                        <TextField value={record?.op?.produto || 'Não informado'} />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, md: 3 }}>
                                        <Typography variant="body2" color="text.secondary">Status</Typography>
                                        <TextField value={record?.op?.status || 'Não informado'} />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, md: 3 }}>
                                        <Typography variant="body2" color="text.secondary">ID</Typography>
                                        <TextField value={record?.opId} />
                                    </Grid2>
                                </Grid2>
                            </CardContent>
                        </Card>
                    </Grid2>
                </Grid2>
            </Stack>
        </Show>
    )
}