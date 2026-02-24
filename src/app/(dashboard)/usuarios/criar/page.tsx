"use client";

import { Box, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "@/validations/userSchema";
import styles from "./create.module.scss";
import { RefineSelect } from "@components/forms";

export interface Setor {
  id: number;
  nome: string;
}

export default function UserCreate() {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    formState: { errors },
    setValue,
    watch,
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

  const handleSetorChange = (value: string | number) => {
    setValue("setor_id", Number(value));
  };

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
    
        </Box>
        <Box className={styles.formRow}>
        <RefineSelect
         resource="setores"
         onChange={handleSetorChange}
         label="Setor"
         value={watch("setor_id")}
        />
        <FormControl 
          fullWidth
          margin="normal"
          className={styles.formField}
        >
          <InputLabel>Cargo</InputLabel>
          <Select
            {...register("cargo")}
            label="Cargo"
            error={!!errors.cargo}
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
    </Create>
  );
}
