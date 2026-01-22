"use client";

import { Box, TextField } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "@/validations/userSchema";
import styles from "./edit.module.scss";

export default function UserEdit() {
  const {
    saveButtonProps,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(updateUserSchema),
  });

  //const setorValue = watch("setor");

  return (
    <Edit saveButtonProps={saveButtonProps}>
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
          className={styles.formField}
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"Nome"}
          name="nome"
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
    </Edit>
  );
}
