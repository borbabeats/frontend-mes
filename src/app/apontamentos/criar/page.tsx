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
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { CreateApontamentoData } from "../../../../types/apontamento";

// Schema de validação usando Zod
const createApontamentoSchema = z.object({
  opId: z.number().min(1, "Ordem de produção é obrigatória"),
  maquinaId: z.number().min(1, "Máquina é obrigatória"),
  usuarioId: z.number().min(1, "Operador é obrigatório"),
  quantidadeProduzida: z.number().min(0, "Quantidade produzida não pode ser negativa").default(0),
  quantidadeDefeito: z.number().min(0, "Quantidade com defeito não pode ser negativa").default(0),
  dataInicio: z.date({
    required_error: "Data de início é obrigatória"
  }),
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

export default function ApontamentoCriar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obter ordemId da URL
  const ordemId = searchParams?.get('ordemId');

  const {
    refineCore: { formLoading, onFinish },
  } = useForm<any, any, CreateApontamentoData>({
    refineCoreProps: {
      resource: "apontamentos",
      action: "create",
      redirect: false,
      onMutationSuccess: () => {
        router.push("/apontamentos");
      },
      onMutationError: (error: any) => {
        console.error("Erro ao criar apontamento:", error);
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          setValidationErrors(errors);
        } else if (error.response?.data?.message) {
          setValidationErrors({ general: error.response.data.message });
        } else {
          setValidationErrors({ general: "Erro ao criar apontamento" });
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

  const validateAndSubmit = async (values: any) => {
    setIsSubmitting(true);
    setValidationErrors({});

    try {
      // Converter strings para números e datas
      const processedValues: CreateApontamentoData = {
        ...values,
        opId: ordemId ? Number(ordemId) : (values.opId ? Number(values.opId) : undefined),
        maquinaId: values.maquinaId ? Number(values.maquinaId) : undefined,
        usuarioId: session?.user?.id || (values.usuarioId ? Number(values.usuarioId) : undefined), // Usar ID do usuário logado
        quantidadeProduzida: values.quantidadeProduzida !== undefined && values.quantidadeProduzida !== '' ? Number(values.quantidadeProduzida) : 0,
        quantidadeDefeito: values.quantidadeDefeito !== undefined && values.quantidadeDefeito !== '' ? Number(values.quantidadeDefeito) : 0,
        dataInicio: values.dataInicio && values.dataInicio !== '' ? new Date(values.dataInicio) : undefined,
        dataFim: values.dataFim && values.dataFim !== '' ? new Date(values.dataFim) : null,
      };

      // Validação do schema
      const result = createApontamentoSchema.safeParse(processedValues);
      
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
      
      // Verificar se máquina existe
      if (processedValues.maquinaId && maquinaOptions) {
        const maquinaExists = maquinaOptions.some((op: any) => op.value === processedValues.maquinaId);
        if (!maquinaExists) {
          additionalErrors.maquinaId = "Máquina não encontrada";
        }
      }

      // Verificar se OP existe
      if (processedValues.opId && opOptions) {
        const opExists = opOptions.some((op: any) => op.value === processedValues.opId);
        if (!opExists) {
          additionalErrors.opId = "Ordem de produção não encontrada";
        }
      }

      // Pular verificação de usuário se estiver usando o usuário logado
      if (processedValues.usuarioId && processedValues.usuarioId !== session?.user?.id && usuarioOptions) {
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
          Criar Apontamento
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
              {/* Ordem de Produção - Obrigatório */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                {ordemId ? (
                  <>
                    <TextField
                      fullWidth
                      id="opId"
                      name="opId"
                      label="Ordem de Produção"
                      value={opOptions?.find((op: any) => op.value === Number(ordemId))?.label || ''}
                      disabled
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ProductionQuantityLimits />
                          </InputAdornment>
                        ),
                      }}
                      helperText="Ordem de produção selecionada automaticamente"
                    />
                    <input
                      type="hidden"
                      name="opId"
                      value={ordemId}
                    />
                  </>
                ) : (
                  <FormControl fullWidth required>
                    <InputLabel id="opId-label">Ordem de Produção *</InputLabel>
                    <Select
                      labelId="opId-label"
                      id="opId"
                      name="opId"
                      label="Ordem de Produção *"
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
                )}
              </Grid2>

              {/* Máquina - Obrigatório */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel id="maquinaId-label">Máquina *</InputLabel>
                  <Select
                    labelId="maquinaId-label"
                    id="maquinaId"
                    name="maquinaId"
                    label="Máquina *"
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

              {/* Usuário/Operador - Preenchido automaticamente */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="usuarioId"
                  name="usuarioId"
                  label="Operador"
                  value={session?.user?.name || ''}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ErrorOutline />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Usuário logado automaticamente"
                />
              </Grid2>

              {/* Data de Início - Obrigatório */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  required
                  id="dataInicio"
                  name="dataInicio"
                  label="Data de Início *"
                  type="datetime-local"
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

              {/* Quantidade Produzida - Opcional (padrão 0) */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="quantidadeProduzida"
                  name="quantidadeProduzida"
                  label="Quantidade Produzida"
                  type="number"
                  defaultValue={0}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ProductionQuantityLimits />
                      </InputAdornment>
                    ),
                  }}
                  error={!!validationErrors.quantidadeProduzida}
                  helperText={validationErrors.quantidadeProduzida || "Padrão: 0"}
                />
              </Grid2>

              {/* Quantidade com Defeito - Opcional (padrão 0) */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="quantidadeDefeito"
                  name="quantidadeDefeito"
                  label="Quantidade com Defeito"
                  type="number"
                  defaultValue={0}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ErrorOutline />
                      </InputAdornment>
                    ),
                  }}
                  error={!!validationErrors.quantidadeDefeito}
                  helperText={validationErrors.quantidadeDefeito || "Padrão: 0"}
                />
              </Grid2>

              {/* Data de Fim - Opcional */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="dataFim"
                  name="dataFim"
                  label="Data de Fim"
                  type="datetime-local"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Schedule />
                      </InputAdornment>
                    ),
                  }}
                  error={!!validationErrors.dataFim}
                  helperText={validationErrors.dataFim || "Opcional - pode ser deixado em branco"}
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
                  {isSubmitting ? 'Criando...' : 'Criar Apontamento'}
                </Button>
              </Stack>
            </CardActions>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}