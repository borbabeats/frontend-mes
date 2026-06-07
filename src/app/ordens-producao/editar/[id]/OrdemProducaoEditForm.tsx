"use client";

import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Grid2 } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useSelect } from "@refinedev/core";
import { Controller } from "react-hook-form";

interface OrdemProducaoEditFormProps {
  id: string;
}

export default function OrdemProducaoEditForm({ id }: OrdemProducaoEditFormProps) {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource: "ordens-producao",
      id,
      action: "edit",
      redirect: "list",
    },
  });

  const { options: setoresOptions } = useSelect({
    resource: "setores",
    optionLabel: "nome",
    optionValue: "id",
    pagination: { mode: "off" },
  });

  const { options: usuariosOptions } = useSelect({
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
            <TextField
              {...register("codigo", { required: "Este campo é obrigatório" })}
              fullWidth
              label="Código da OP"
              error={!!(errors as any)?.codigo}
              helperText={(errors as any)?.codigo?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              {...register("produto", { required: "Este campo é obrigatório" })}
              fullWidth
              label="Produto"
              error={!!(errors as any)?.produto}
              helperText={(errors as any)?.produto?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <TextField
              {...register("descricao")}
              fullWidth
              label="Descrição"
              multiline
              rows={2}
              InputLabelProps={{ shrink: true }}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 4 }}>
            <TextField
              {...register("quantidadePlanejada", { required: "Este campo é obrigatório", valueAsNumber: true })}
              fullWidth
              label="Quantidade Planejada"
              type="number"
              error={!!(errors as any)?.quantidadePlanejada}
              helperText={(errors as any)?.quantidadePlanejada?.message}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: 1 }}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 4 }}>
            <Controller
              control={control}
              name="prioridade"
              rules={{ required: "Este campo é obrigatório" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!(errors as any)?.prioridade}>
                  <InputLabel shrink>Prioridade</InputLabel>
                  <Select {...field} label="Prioridade" value={field.value ?? ""}>
                    <MenuItem value="BAIXA">Baixa</MenuItem>
                    <MenuItem value="MEDIA">Média</MenuItem>
                    <MenuItem value="ALTA">Alta</MenuItem>
                    <MenuItem value="URGENTE">Urgente</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 4 }}>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel shrink>Status</InputLabel>
                  <Select {...field} label="Status" value={field.value ?? ""}>
                    <MenuItem value="PLANEJADA">Planejada</MenuItem>
                    <MenuItem value="EM_ANDAMENTO">Em Andamento</MenuItem>
                    <MenuItem value="CONCLUIDA">Concluída</MenuItem>
                    <MenuItem value="CANCELADA">Cancelada</MenuItem>
                    <MenuItem value="PAUSADA">Pausada</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              {...register("dataInicioPlanejado", { required: "Este campo é obrigatório" })}
              fullWidth
              label="Data Início Planejado"
              type="datetime-local"
              error={!!(errors as any)?.dataInicioPlanejado}
              helperText={(errors as any)?.dataInicioPlanejado?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              {...register("dataFimPlanejado", { required: "Este campo é obrigatório" })}
              fullWidth
              label="Data Fim Planejado"
              type="datetime-local"
              error={!!(errors as any)?.dataFimPlanejado}
              helperText={(errors as any)?.dataFimPlanejado?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="setorId"
              rules={{ required: "Este campo é obrigatório" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!(errors as any)?.setorId}>
                  <InputLabel shrink>Setor</InputLabel>
                  <Select {...field} label="Setor" value={field.value ?? ""}
                    onChange={e => field.onChange(Number(e.target.value))}>
                    {setoresOptions?.map((o: any) => (
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
              name="responsavelId"
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel shrink>Responsável</InputLabel>
                  <Select {...field} label="Responsável" value={field.value ?? ""}
                    onChange={e => field.onChange(e.target.value ? Number(e.target.value) : "")}>
                    <MenuItem value="">Nenhum</MenuItem>
                    {usuariosOptions?.map((o: any) => (
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
              name="origemTipo"
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel shrink>Tipo de Origem</InputLabel>
                  <Select {...field} label="Tipo de Origem" value={field.value ?? ""}>
                    <MenuItem value="">Nenhum</MenuItem>
                    <MenuItem value="PEDIDO_VENDA">Pedido de Venda</MenuItem>
                    <MenuItem value="REPOSICAO_ESTOQUE">Reposição de Estoque</MenuItem>
                    <MenuItem value="PLANO_MESTRE_PRODUCAO">Plano Mestre de Produção</MenuItem>
                    <MenuItem value="DEMANDA_INTERNA">Demanda Interna</MenuItem>
                    <MenuItem value="PREVISAO_VENDAS">Previsão de Vendas</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              {...register("origemId")}
              fullWidth
              label="ID da Origem"
              InputLabelProps={{ shrink: true }}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <TextField
              {...register("observacoes")}
              fullWidth
              label="Observações"
              multiline
              rows={3}
              InputLabelProps={{ shrink: true }}
            />
          </Grid2>
        </Grid2>
      </Box>
    </Edit>
  );
}
