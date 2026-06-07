"use client";

import {
  Box, TextField, FormControl, InputLabel, Select, MenuItem, Grid2,
} from "@mui/material";
import { AttachMoney } from "@mui/icons-material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useSelect } from "@refinedev/core";
import { Controller } from "react-hook-form";

interface ManutencaoEditFormProps {
  id: string;
}

export default function ManutencaoEditForm({ id }: ManutencaoEditFormProps) {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    control,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource: "manutencoes",
      id,
      action: "edit",
      redirect: "list",
    },
  });

  const { options: maquinasOptions } = useSelect({
    resource: "maquinas",
    optionLabel: "nome",
    optionValue: "id",
    pagination: { mode: "off" },
  });

  const { options: responsaveisOptions } = useSelect({
    resource: "usuarios",
    optionLabel: "nome",
    optionValue: "id",
    pagination: { mode: "off" },
  });

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box sx={{ mt: 2 }}>
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="maquinaId"
              rules={{ required: "Selecione uma máquina" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!(errors as any)?.maquinaId}>
                  <InputLabel>Máquina</InputLabel>
                  <Select {...field} label="Máquina" value={field.value ?? ""}
                    onChange={e => field.onChange(Number(e.target.value))}>
                    {maquinasOptions?.map((o: any) => (
                      <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                    ))}
                  </Select>
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
                <FormControl fullWidth error={!!(errors as any)?.tipo}>
                  <InputLabel>Tipo de Manutenção</InputLabel>
                  <Select {...field} label="Tipo de Manutenção" value={field.value ?? ""}>
                    <MenuItem value="PREVENTIVA">Preventiva</MenuItem>
                    <MenuItem value="CORRETIVA">Corretiva</MenuItem>
                    <MenuItem value="PREDITIVA">Preditiva</MenuItem>
                    <MenuItem value="EMERGENCIAL">Emergencial</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="status"
              rules={{ required: "Selecione o status" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!(errors as any)?.status}>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status" value={field.value ?? ""}>
                    <MenuItem value="AGENDADA">Agendada</MenuItem>
                    <MenuItem value="EM_ANDAMENTO">Em Andamento</MenuItem>
                    <MenuItem value="CONCLUIDA">Concluída</MenuItem>
                    <MenuItem value="CANCELADA">Cancelada</MenuItem>
                    <MenuItem value="ATRASADA">Atrasada</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="responsavelId"
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Responsável</InputLabel>
                  <Select {...field} label="Responsável" value={field.value ?? ""}
                    onChange={e => field.onChange(e.target.value ? Number(e.target.value) : "")}>
                    <MenuItem value="">Nenhum</MenuItem>
                    {responsaveisOptions?.map((o: any) => (
                      <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Controller
              control={control}
              name="descricao"
              rules={{ required: "Descrição é obrigatória" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Descrição"
                  multiline
                  rows={3}
                  error={!!(errors as any)?.descricao}
                  helperText={(errors as any)?.descricao?.message}
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
                  label="Data e Hora Agendada"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  error={!!(errors as any)?.dataAgendada}
                  helperText={(errors as any)?.dataAgendada?.message}
                />
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="dataInicio"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Data de Início"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  value={field.value ?? ""}
                />
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="dataFim"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Data de Fim"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  value={field.value ?? ""}
                />
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="custoEstimado"
              render={({ field: { onChange, ...field } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Custo Estimado (R$)"
                  type="number"
                  InputProps={{ startAdornment: <AttachMoney sx={{ mr: 1, color: "text.secondary" }} /> }}
                  onChange={e => onChange(e.target.value ? Number(e.target.value) : undefined)}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="custoReal"
              render={({ field: { onChange, ...field } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Custo Real (R$)"
                  type="number"
                  InputProps={{ startAdornment: <AttachMoney sx={{ mr: 1, color: "text.secondary" }} /> }}
                  onChange={e => onChange(e.target.value ? Number(e.target.value) : undefined)}
                  inputProps={{ min: 0, step: 0.01 }}
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
                  label="Observações"
                  multiline
                  rows={3}
                  value={field.value ?? ""}
                />
              )}
            />
          </Grid2>
        </Grid2>
      </Box>
    </Edit>
  );
}
