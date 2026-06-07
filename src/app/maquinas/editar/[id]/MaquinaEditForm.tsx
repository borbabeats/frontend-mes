"use client";

import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useList } from "@refinedev/core";

interface MaquinaEditFormProps {
  id: string;
}

export default function MaquinaEditForm({ id }: MaquinaEditFormProps) {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource: "maquinas",
      id,
      action: "edit",
      redirect: "list",
    },
  });

  const { result: { data: setores } } = useList({ resource: "setores", pagination: { mode: "off" } });

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}
        autoComplete="off"
      >
        <TextField
          {...register("codigo")}
          error={!!(errors as any)?.codigo}
          helperText={(errors as any)?.codigo?.message}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Código"
        />

        <TextField
          {...register("nome", { required: "Este campo é obrigatório" })}
          error={!!(errors as any)?.nome}
          helperText={(errors as any)?.nome?.message}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Nome"
        />

        <TextField
          {...register("descricao")}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Descrição"
          multiline
          rows={3}
          sx={{ gridColumn: "1 / -1" }}
        />

        <TextField
          {...register("fabricante", { required: "Este campo é obrigatório" })}
          error={!!(errors as any)?.fabricante}
          helperText={(errors as any)?.fabricante?.message}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Fabricante"
        />

        <TextField
          {...register("modelo", { required: "Este campo é obrigatório" })}
          error={!!(errors as any)?.modelo}
          helperText={(errors as any)?.modelo?.message}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Modelo"
        />

        <TextField
          {...register("numeroSerie", { required: "Este campo é obrigatório" })}
          error={!!(errors as any)?.numeroSerie}
          helperText={(errors as any)?.numeroSerie?.message}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Número de Série"
        />

        <TextField
          {...register("anoFabricacao", { required: "Este campo é obrigatório", valueAsNumber: true })}
          error={!!(errors as any)?.anoFabricacao}
          helperText={(errors as any)?.anoFabricacao?.message}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="number"
          label="Ano de Fabricação"
        />

        <TextField
          {...register("capacidade", { required: "Este campo é obrigatório" })}
          error={!!(errors as any)?.capacidade}
          helperText={(errors as any)?.capacidade?.message}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Capacidade"
        />

        <Controller
          name="status"
          control={control}
          rules={{ required: "Este campo é obrigatório" }}
          render={({ field }) => (
            <FormControl margin="normal" fullWidth error={!!(errors as any)?.status}>
              <InputLabel shrink>Status</InputLabel>
              <Select {...field} label="Status" value={field.value ?? ""}>
                <MenuItem value="DISPONIVEL">Disponível</MenuItem>
                <MenuItem value="EM_USO">Em Uso</MenuItem>
                <MenuItem value="MANUTENCAO">Manutenção</MenuItem>
                <MenuItem value="INATIVA">Inativa</MenuItem>
                <MenuItem value="PARADA">Parada</MenuItem>
                <MenuItem value="DESATIVADA">Desativada</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="setorId"
          control={control}
          rules={{ required: "Este campo é obrigatório" }}
          render={({ field }) => (
            <FormControl margin="normal" fullWidth error={!!(errors as any)?.setorId}>
              <InputLabel shrink>Setor</InputLabel>
              <Select {...field} label="Setor" value={field.value ?? ""}
                onChange={e => field.onChange(Number(e.target.value))}>
                {setores?.map((s: any) => (
                  <MenuItem key={s.id} value={s.id}>{s.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>
    </Edit>
  );
}
