'use client';

import React, { useEffect } from 'react';
import { Box, TextField, Button, Grid2, Typography, Alert, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useRouter } from 'next/navigation';
import { Save, ArrowBack } from '@mui/icons-material';
import { RefineSelect } from "@components/forms";
import { formatDateTime } from '@utils/dateUtils';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface NovaManutencao {
  titulo: string;
  descricao: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  dataAgendada: string;
  maquinaId: number;
  tecnicoResponsavel: string;
  observacoes: string;
}

export default function CriarManutencaoPage() {
  const router = useRouter();
  
  const {
    saveButtonProps,
    refineCore: { formLoading, onFinish },
    register,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
  } = useForm<NovaManutencao>({
    defaultValues: {
      titulo: '',
      descricao: '',
      prioridade: 'MEDIA',
      dataAgendada: '',
      maquinaId: 0,
      tecnicoResponsavel: '',
      observacoes: ''
    },
  });

  // Garantir que o valor padrão seja definido
  useEffect(() => {
    setValue("prioridade", "MEDIA");
  }, [setValue]);

  const handleMaquinaChange = (value: string | number) => {
    setValue("maquinaId", Number(value));
  };

  const handleSuccess = () => {
    router.push('/manutencoes');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Create 
      isLoading={formLoading} 
      saveButtonProps={{
        ...saveButtonProps,
        children: 'Salvar Manutenção',
        onClick: handleSubmit(onFinish)
      }}
      title="Nova Manutenção"
    >
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        autoComplete="off"
      >
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              {...register("titulo", { required: "O título é obrigatório" })}
              error={!!errors.titulo}
              helperText={errors.titulo?.message as string}
              fullWidth
              label="Título da Manutenção"
              margin="normal"
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              {...register("dataAgendada", { required: "A data agendada é obrigatória" })}
              error={!!errors.dataAgendada}
              helperText={errors.dataAgendada?.message as string}
              fullWidth
              label="Data e Hora Agendada"
              type="datetime-local"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().slice(0, 16)
              }}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <TextField
              {...register("descricao", { required: "A descrição é obrigatória" })}
              error={!!errors.descricao}
              helperText={errors.descricao?.message as string}
              fullWidth
              label="Descrição"
              multiline
              rows={4}
              margin="normal"
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <RefineSelect
              resource="maquinas"
              onChange={handleMaquinaChange}
              label="Máquina"
              value={watch("maquinaId")}
              required={true}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              {...register("tecnicoResponsavel")}
              fullWidth
              label="Técnico Responsável"
              margin="normal"
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Prioridade</InputLabel>
              <Select
                {...register("prioridade")}
                label="Prioridade"
                defaultValue="MEDIA"
              >
                <MenuItem value="BAIXA">Baixa</MenuItem>
                <MenuItem value="MEDIA">Média</MenuItem>
                <MenuItem value="ALTA">Alta</MenuItem>
                <MenuItem value="URGENTE">Urgente</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <TextField
              {...register("observacoes")}
              fullWidth
              label="Observações"
              multiline
              rows={3}
              margin="normal"
            />
          </Grid2>
        </Grid2>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBack}
          >
            Voltar
          </Button>
        </Box>
      </Box>
    </Create>
  );
}
