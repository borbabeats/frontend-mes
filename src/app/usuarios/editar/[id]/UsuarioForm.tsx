"use client";

import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";

interface UsuarioFormProps {
  id: string;
}

export default function UsuarioForm({ id }: UsuarioFormProps) {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource: "usuarios",
      id,
      action: "edit",
      redirect: "list",
    },
  });

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}
        autoComplete="off"
      >
        <TextField
          {...register("nome", { required: "Este campo é obrigatório" })}
          error={!!(errors as any)?.nome}
          helperText={(errors as any)?.nome?.message}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          label="Nome"
        />

        <TextField
          {...register("email", { required: "Este campo é obrigatório" })}
          error={!!(errors as any)?.email}
          helperText={(errors as any)?.email?.message}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="email"
          label="Email"
        />

        <Controller
          name="cargo"
          control={control}
          rules={{ required: "Este campo é obrigatório" }}
          render={({ field }) => (
            <FormControl margin="normal" fullWidth error={!!(errors as any)?.cargo}>
              <InputLabel shrink>Cargo</InputLabel>
              <Select {...field} label="Cargo" value={field.value ?? ""}>
                <MenuItem value="ADMIN">Administrador</MenuItem>
                <MenuItem value="GERENTE">Gerente</MenuItem>
                <MenuItem value="OPERADOR">Operador</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>
    </Edit>
  );
}
