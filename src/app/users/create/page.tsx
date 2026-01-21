"use client";

import { Box, TextField } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "@/validations/userSchema";
import styles from "./create.module.scss";

export default function CategoryCreate() {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      cargo: "",
      setor_id: undefined,
    },
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        className={styles.formContainer}
        autoComplete="off"
      >
        <Box className={styles.formRow}>
        <TextField
          {...register("nome")}
          error={!!errors.nome}
          helperText={errors.nome?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"Nome"}
          name="nome"
        />
        <TextField
          {...register("senha")}
          error={!!errors.senha}
          helperText={errors.senha?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="password"
          label={"Senha"}
          name="senha"
          autoComplete="off"
        />
        <TextField
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          margin="normal"
          className={styles.formField}
          InputLabelProps={{ shrink: true }}
          type="email"
          label={"Email"}
          name="email"
        />
        </Box>
        <Box className={styles.formRow}>
        <TextField
          {...register("cargo")}
          error={!!errors.cargo}
          helperText={errors.cargo?.message}
          margin="normal"
          className={styles.formField}
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"Cargo"}
          name="cargo"
        />
        <TextField
          {...register("setor_id", { valueAsNumber: true })}
          error={!!errors.setor_id}
          helperText={errors.setor_id?.message}
          margin="normal"
          className={styles.formField}
          InputLabelProps={{ shrink: true }}
          type="number"
          label={"ID do Setor"}
          name="setor_id"
        />
        </Box>
      </Box>
    </Create>
  );
}
