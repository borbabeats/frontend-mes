'use client';

import { useForm } from "@refinedev/react-hook-form";
import { useSelect } from "@refinedev/core";
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Grid2,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import { 
  Save, 
  ArrowBack,
  Schedule,
  ProductionQuantityLimits,
  ErrorOutline
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { UpdateApontamentoData, Apontamento } from "../../../../types/apontamento";

// Schema de validação usando Zod
const updateApontamentoSchema = z.object({
  opId: z.number().optional(),
  maquinaId: z.number().optional(),
  usuarioId: z.number().optional(),
  quantidadeProduzida: z.number().min(0, "Quantidade produzida não pode ser negativa").optional(),
  quantidadeDefeito: z.number().min(0, "Quantidade com defeito não pode ser negativa").optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().nullable().optional(),
}).refine((data) => {
  if (data.dataInicio && data.dataFim && data.dataFim < data.dataInicio) {
    return false;
  }
  return true;
}, {
  message: "Data de início não pode ser maior que data de fim",
  path: ["dataFim"]
});

export default function ApontamentoEdit() {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    refineCore: { query, formLoading, onFinish },
  } = useForm<Apontamento, any, UpdateApontamentoData>({
    refineCoreProps: {
      resource: "apontamentos",
      action: "edit",
      redirect: false,
      onMutationSuccess: () => {
        router.push("/apontamentos");
      },
      onMutationError: (error: any) => {
        console.error("Erro ao atualizar apontamento:", error);
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          setValidationErrors(errors);
        } else if (error.response?.data?.message) {
          setValidationErrors({ general: error.response.data.message });
        } else {
          setValidationErrors({ general: "Erro ao atualizar apontamento" });
        }
      }
    }
  });

  // Carregar dados para os selects
  const { options: opOptions } = useSelect({
    resource: "ordens-producao",
    optionLabel: "codigo",
    optionValue: "id",
    pagination: { mode: "off" },
  });

  const { options: maquinaOptions } = useSelect({
    resource: "maquinas",
    optionLabel: "nome",
    optionValue: "id",
    pagination: { mode: "off" },
  });

  const { options: usuarioOptions } = useSelect({
    resource: "usuarios",
    optionLabel: "nome",
    optionValue: "id",
    pagination: { mode: "off" },
  });

  const apontamento = query?.data?.data;

  const validateAndSubmit = async (values: any) => {
    setIsSubmitting(true);
    setValidationErrors({});

    try {
      // Converter strings para números e datas
      const processedValues: UpdateApontamentoData = {
        ...values,
        opId: values.opId ? Number(values.opId) : undefined,
        maquinaId: values.maquinaId ? Number(values.maquinaId) : undefined,
        usuarioId: values.usuarioId ? Number(values.usuarioId) : undefined,
        quantidadeProduzida: values.quantidadeProduzida !== undefined && values.quantidadeProduzida !== '' ? Number(values.quantidadeProduzida) : undefined,
        quantidadeDefeito: values.quantidadeDefeito !== undefined && values.quantidadeDefeito !== '' ? Number(values.quantidadeDefeito) : undefined,
        dataInicio: values.dataInicio && values.dataInicio !== '' ? new Date(values.dataInicio) : undefined,
        dataFim: values.dataFim && values.dataFim !== '' ? new Date(values.dataFim) : null,
      };

      // Validação do schema
      const result = updateApontamentoSchema.safeParse(processedValues);
      
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            errors[issue.path[0] as string] = issue.message;
          } else {
            errors.general = issue.message;
          }
        });
        setValidationErrors(errors);
        setIsSubmitting(false);
        return;
      }

      // Validações adicionais no frontend
      const additionalErrors: Record<string, string> = {};
      
      // Verificar se máquina existe (se fornecida)
      if (processedValues.maquinaId && maquinaOptions) {
        const maquinaExists = maquinaOptions.some((op: any) => op.value === processedValues.maquinaId);
        if (!maquinaExists) {
          additionalErrors.maquinaId = "Máquina não encontrada";
        }
      }

      // Verificar se OP existe (se fornecida)
      if (processedValues.opId && opOptions) {
        const opExists = opOptions.some((op: any) => op.value === processedValues.opId);
        if (!opExists) {
          additionalErrors.opId = "Ordem de produção não encontrada";
        }
      }

      // Verificar se usuário existe (se fornecido)
      if (processedValues.usuarioId && usuarioOptions) {
        const usuarioExists = usuarioOptions.some((user: any) => user.value === processedValues.usuarioId);
        if (!usuarioExists) {
          additionalErrors.usuarioId = "Usuário não encontrado";
        }
      }

      if (Object.keys(additionalErrors).length > 0) {
        setValidationErrors(additionalErrors);
        setIsSubmitting(false);
        return;
      }

      // Enviar dados
      await onFinish(processedValues);
    } catch (error) {
      console.error("Erro na validação:", error);
      setValidationErrors({ general: "Erro ao processar formulário" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/apontamentos");
  };

  if (formLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
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
          Editar Apontamento
        </Typography>
      </Box>

      {validationErrors.general && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {validationErrors.general}
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const values: any = {};
            
            // Obter todos os valores do formulário
            Array.from(formData.entries()).forEach(([key, value]) => {
              if (value === '') {
                values[key] = undefined;
              } else {
                values[key] = value;
              }
            });
            
            validateAndSubmit(values);
          }}>
            <Grid2 container spacing={3}>
              {/* Ordem de Produção */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="opId-label">Ordem de Produção</InputLabel>
                  <Select
                    labelId="opId-label"
                    id="opId"
                    name="opId"
                    label="Ordem de Produção"
                    defaultValue={apontamento?.opId || ''}
                    error={!!validationErrors.opId}
                  >
                    <MenuItem value="">Selecione uma OP</MenuItem>
                    {opOptions?.map((op: any) => (
                      <MenuItem key={op.value} value={op.value}>
                        {op.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.opId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {validationErrors.opId}
                    </Typography>
                  )}
                </FormControl>
              </Grid2>

              {/* Máquina */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="maquinaId-label">Máquina</InputLabel>
                  <Select
                    labelId="maquinaId-label"
                    id="maquinaId"
                    name="maquinaId"
                    label="Máquina"
                    defaultValue={apontamento?.maquinaId || ''}
                    error={!!validationErrors.maquinaId}
                  >
                    <MenuItem value="">Selecione uma máquina</MenuItem>
                    {maquinaOptions?.map((maquina: any) => (
                      <MenuItem key={maquina.value} value={maquina.value}>
                        {maquina.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.maquinaId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {validationErrors.maquinaId}
                    </Typography>
                  )}
                </FormControl>
              </Grid2>

              {/* Usuário */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="usuarioId-label">Operador</InputLabel>
                  <Select
                    labelId="usuarioId-label"
                    id="usuarioId"
                    name="usuarioId"
                    label="Operador"
                    defaultValue={apontamento?.usuarioId || ''}
                    error={!!validationErrors.usuarioId}
                  >
                    <MenuItem value="">Selecione um operador</MenuItem>
                    {usuarioOptions?.map((usuario: any) => (
                      <MenuItem key={usuario.value} value={usuario.value}>
                        {usuario.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.usuarioId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {validationErrors.usuarioId}
                    </Typography>
                  )}
                </FormControl>
              </Grid2>

              {/* Quantidade Produzida */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="quantidadeProduzida"
                  name="quantidadeProduzida"
                  label="Quantidade Produzida"
                  type="number"
                  defaultValue={apontamento?.quantidadeProduzida || ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ProductionQuantityLimits />
                      </InputAdornment>
                    ),
                  }}
                  error={!!validationErrors.quantidadeProduzida}
                  helperText={validationErrors.quantidadeProduzida}
                />
              </Grid2>

              {/* Quantidade com Defeito */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="quantidadeDefeito"
                  name="quantidadeDefeito"
                  label="Quantidade com Defeito"
                  type="number"
                  defaultValue={apontamento?.quantidadeDefeito || ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ErrorOutline />
                      </InputAdornment>
                    ),
                  }}
                  error={!!validationErrors.quantidadeDefeito}
                  helperText={validationErrors.quantidadeDefeito}
                />
              </Grid2>

              {/* Data de Início */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="dataInicio"
                  name="dataInicio"
                  label="Data de Início"
                  type="datetime-local"
                  defaultValue={apontamento?.dataInicio ? 
                    new Date(apontamento.dataInicio).toISOString().slice(0, 16) : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Schedule />
                      </InputAdornment>
                    ),
                  }}
                  error={!!validationErrors.dataInicio}
                  helperText={validationErrors.dataInicio}
                />
              </Grid2>

              {/* Data de Fim */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="dataFim"
                  name="dataFim"
                  label="Data de Fim"
                  type="datetime-local"
                  defaultValue={apontamento?.dataFim ? 
                    new Date(apontamento.dataFim).toISOString().slice(0, 16) : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Schedule />
                      </InputAdornment>
                    ),
                  }}
                  error={!!validationErrors.dataFim}
                  helperText={validationErrors.dataFim}
                />
              </Grid2>
            </Grid2>

            <CardActions sx={{ mt: 3, justifyContent: 'flex-end' }}>
              <Stack direction="row" spacing={2}>
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
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
              </Stack>
            </CardActions>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}