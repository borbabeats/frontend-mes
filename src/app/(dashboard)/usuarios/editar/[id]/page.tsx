"use client";

import { Box, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "@/validations/userSchema";
import styles from "./edit.module.scss";
import { RefineSelect } from "@components/forms";

export interface Setor {
  id: number;
  nome: string;
}

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
  const handleSetorChange = (value: string | number) => {
    setValue("setor_id", Number(value));
  };

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
        <RefineSelect
         resource="setores"
         onChange={handleSetorChange}
         label="Setor"
         value={watch("setor_id")}
        />
        <FormControl 
          margin="normal"
          className={styles.formField}
        >
          <InputLabel>Cargo</InputLabel>
          <Select
            {...register("cargo")}
            label="Cargo"
            error={!!errors.cargo}
            value={watch("cargo")}
            onChange={(e) => setValue("cargo", e.target.value)}
          >
            <MenuItem value="">Selecione um cargo</MenuItem>
            <MenuItem value="ADMIN">Administrador</MenuItem>
            <MenuItem value="GERENTE">Gerente</MenuItem>
            <MenuItem value="OPERADOR">Operador</MenuItem>
          </Select>
          {errors.cargo?.message && (
            <FormHelperText error>{errors.cargo.message}</FormHelperText>
          )}
        </FormControl>
        </Box>
      </Box>
    </Edit>
  );
}
