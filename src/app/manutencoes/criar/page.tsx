"use client";

import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useSelect } from "@refinedev/core";
import { 
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid2,
  Stack,
  Alert
} from "@mui/material";
import { 
  Save,
  ArrowBack,
  Build,
  Schedule,
  AttachMoney
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { LoadingOverlay } from "@/components/LoadingOverlay";

interface AgendarManutencaoDto {
  maquinaId: number;
  tipo: "PREVENTIVA" | "CORRETIVA" | "PREDITIVA" | "EMERGENCIAL";
  descricao: string;
  dataAgendada: string;
  custoEstimado?: number;
  responsavelId?: number;
  observacoes?: string;
}

export default function CriarManutencaoPage() {
  const router = useRouter();
  const {
    saveButtonProps,
    refineCore: { formLoading },
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<AgendarManutencaoDto>({
    refineCoreProps: {
      resource: "manutencoes",
      action: "create",
      redirect: false,
      successNotification: {
        message: "Manutenção agendada com sucesso!",
        type: "success",
      },
    },
  });

  const { options: maquinasOptions } = useSelect({
    resource: "maquinas",
    optionLabel: "nome",
    optionValue: "id",
  });

  const { options: responsaveisOptions } = useSelect({
    resource: "usuarios",
    optionLabel: "nome",
    optionValue: "id",
    filters: [
      {
        field: "role",
        operator: "in" as const,
        value: ["ADMIN", "GERENTE"],
      },
    ],
  });

  const onSubmit = async (data: any) => {
    try {
      await saveButtonProps.onClick({} as any);
      router.push("/manutencoes");
    } catch (error) {
      console.error("Erro ao criar manutenção:", error);
    }
  };

  return (
    <Create
      title="Agendar Nova Manutenção"
      goBack={<Button startIcon={<ArrowBack />} onClick={() => router.back()}>Voltar</Button>}
      footerButtons={
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSubmit(onSubmit)}
            disabled={formLoading}
          >
            Agendar Manutenção
          </Button>
        </Stack>
      }
    >
      <LoadingOverlay isLoading={formLoading} message="Salvando..." subMessage="Processando agendamento" />
      
      <Box sx={{ mt: 2 }}>
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="maquinaId"
              rules={{ required: "Selecione uma máquina" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.maquinaId}>
                  <InputLabel id="maquina-label">Máquina *</InputLabel>
                  <Select
                    {...field}
                    labelId="maquina-label"
                    label="Máquina *"
                  >
                    {maquinasOptions?.map((option: any) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.maquinaId && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {String(errors.maquinaId.message)}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="tipo"
              rules={{ required: "Selecione o tipo de manutenção" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.tipo}>
                  <InputLabel id="tipo-label">Tipo de Manutenção *</InputLabel>
                  <Select
                    {...field}
                    labelId="tipo-label"
                    label="Tipo de Manutenção *"
                  >
                    <MenuItem value="PREVENTIVA">Preventiva</MenuItem>
                    <MenuItem value="CORRETIVA">Corretiva</MenuItem>
                    <MenuItem value="PREDITIVA">Preditiva</MenuItem>
                    <MenuItem value="EMERGENCIAL">Emergencial</MenuItem>
                  </Select>
                  {errors.tipo && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {String(errors.tipo.message)}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Controller
              control={control}
              name="descricao"
              rules={{ 
                required: "Descrição é obrigatória",
                minLength: {
                  value: 10,
                  message: "Descrição deve ter pelo menos 10 caracteres"
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Descrição *"
                  multiline
                  rows={3}
                  placeholder="Descreva detalhadamente o que será feito na manutenção..."
                  error={!!errors.descricao}
                  helperText={errors.descricao ? String(errors.descricao.message) : undefined}
                />
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="dataAgendada"
              rules={{ required: "Data agendada é obrigatória" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Data e Hora Agendada *"
                  type="datetime-local"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.dataAgendada}
                  helperText={errors.dataAgendada ? String(errors.dataAgendada.message) : undefined}
                  inputProps={{
                    min: new Date().toISOString().slice(0, 16)
                  }}
                />
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="responsavelId"
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id="responsavel-label">Responsável (Opcional)</InputLabel>
                  <Select
                    {...field}
                    labelId="responsavel-label"
                    label="Responsável (Opcional)"
                  >
                    <MenuItem value="">Nenhum responsável definido</MenuItem>
                    {responsaveisOptions?.map((option: any) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="custoEstimado"
              rules={{
                min: {
                  value: 0,
                  message: "Custo estimado deve ser positivo"
                }
              }}
              render={({ field: { onChange, ...field } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Custo Estimado (R$)"
                  type="number"
                  InputProps={{
                    startAdornment: <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
                  error={!!errors.custoEstimado}
                  helperText={errors.custoEstimado ? String(errors.custoEstimado.message) : undefined}
                  inputProps={{
                    min: 0,
                    step: 0.01
                  }}
                />
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Controller
              control={control}
              name="observacoes"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Observações (Opcional)"
                  multiline
                  rows={3}
                  placeholder="Informações adicionais sobre a manutenção..."
                />
              )}
            />
          </Grid2>
        </Grid2>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Informações importantes:</strong>
            <br />• A manutenção será criada com status &quot;AGENDADA&quot;
            <br />• Você será notificado quando a data agendada se aproximar
            <br />• O status pode ser alterado posteriormente
          </Typography>
        </Alert>
      </Box>
    </Create>
  );
}
