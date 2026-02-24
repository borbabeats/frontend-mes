"use client";

import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { createMaquinaSchema } from "@/validations/maquinaSchema";
import { yupResolver } from "@hookform/resolvers/yup";

export default function MaquinaCreate() {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource: "maquinas",
      action: "create",
    },
    resolver: yupResolver(createMaquinaSchema),
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("codigo")}
          error={!!(errors as any)?.codigo}
          helperText={(errors as any)?.codigo?.message}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Código"
          name="codigo"
        />
        
        <TextField
          {...register("nome", {
            required: "Este campo é obrigatório",
          })}
          error={!!(errors as any)?.nome}
          helperText={(errors as any)?.nome?.message}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Nome"
          name="nome"
        />
        
        <TextField
          {...register("descricao")}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Descrição"
          name="descricao"
          multiline
          rows={3}
        />
        
        <TextField
          {...register("fabricante", {
            required: "Este campo é obrigatório",
          })}
          error={!!(errors as any)?.fabricante}
          helperText={(errors as any)?.fabricante?.message}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Fabricante"
          name="fabricante"
        />
        
        <TextField
          {...register("modelo", {
            required: "Este campo é obrigatório",
          })}
          error={!!(errors as any)?.modelo}
          helperText={(errors as any)?.modelo?.message}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Modelo"
          name="modelo"
        />
        
        <TextField
          {...register("numeroSerie", {
            required: "Este campo é obrigatório",
          })}
          error={!!(errors as any)?.numeroSerie}
          helperText={(errors as any)?.numeroSerie?.message}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Número de Série"
          name="numeroSerie"
        />
        
        <TextField
          {...register("anoFabricacao", {
            required: "Este campo é obrigatório",
            valueAsNumber: true,
          })}
          error={!!(errors as any)?.anoFabricacao}
          helperText={(errors as any)?.anoFabricacao?.message}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="number"
          label="Ano de Fabricação"
          name="anoFabricacao"
        />
        
        <TextField
          {...register("capacidade", {
            required: "Este campo é obrigatório",
          })}
          error={!!(errors as any)?.capacidade}
          helperText={(errors as any)?.capacidade?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Capacidade"
          name="capacidade"
        />
        
        <FormControl margin="normal" fullWidth>
          <InputLabel shrink>Status</InputLabel>
          <Select
            {...register("status", {
              required: "Este campo é obrigatório",
            })}
            label="Status"
            defaultValue=""
            displayEmpty
          >
            <MenuItem value="DISPONIVEL">Disponível</MenuItem>
            <MenuItem value="EM_USO">Em Uso</MenuItem>
            <MenuItem value="MANUTENCAO">Manutenção</MenuItem>
            <MenuItem value="INATIVA">Inativa</MenuItem>
            <MenuItem value="PARADA">Parada</MenuItem>
            <MenuItem value="DESATIVADA">Desativada</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          {...register("setorId", {
            required: "Este campo é obrigatório",
            valueAsNumber: true,
          })}
          error={!!(errors as any)?.setorId}
          helperText={(errors as any)?.setorId?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="number"
          label="ID do Setor"
          name="setorId"
        />
      </Box>
    </Create>
  );
}
