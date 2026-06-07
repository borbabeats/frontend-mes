"use client";

import { Box, TextField } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";

interface SetorEditFormProps {
  id: string;
}

export default function SetorEditForm({ id }: SetorEditFormProps) {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource: "setores",
      id,
      action: "edit",
      redirect: "list",
    },
  });

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("nome", { required: "Este campo é obrigatório" })}
          error={!!errors?.nome}
          helperText={errors?.nome?.message as string}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Nome"
        />
      </Box>
    </Edit>
  );
}
