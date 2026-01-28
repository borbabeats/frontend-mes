"use client";

import { Stack, Typography, Box, Avatar } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import styles from "./show.module.scss";
import statusMaquina from "@utils/status_maquina";

export default function MaquinasShow() {
  const { query } = useShow({});
  const { data, isLoading } = query;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={3}>
        {/* Header com foto e informações principais */}
        <Box className={styles.userHeader}>
          <Box>
            <Typography variant="h4">{record?.nome}</Typography>
            <Typography variant="body2" color="text.secondary">
              {record?.codigo}
            </Typography>
          </Box>
        </Box>

        {/* Informações detalhadas */}
        <Box className={styles.detailsContainer}>
          <Box className={styles.detailItem}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {"ID"}
            </Typography>
            <TextField value={record?.id} />
          </Box>
          
          <Box className={styles.detailItem}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {"Código"}
            </Typography>
            <TextField value={record?.codigo} />
          </Box>
          
          <Box className={styles.detailItem}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {"Nome"}
            </Typography>
            <TextField value={record?.nome} />
          </Box>
          
          <Box className={styles.detailItem}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {"Descrição"}
            </Typography>
            <TextField value={record?.descricao || 'Não informado'} />
          </Box>
          
          <Box className={styles.detailItem}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {"Fabricante"}
            </Typography>
            <TextField value={record?.fabricante} />
          </Box>
          
          <Box className={styles.detailItem}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {"Modelo"}
            </Typography>
            <TextField value={record?.modelo} />
          </Box>
          
          <Box className={styles.detailItem}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {"Número de Série"}
            </Typography>
            <TextField value={record?.numeroSerie} />
          </Box>
          
          <Box className={styles.detailItem}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {"Ano de Fabricação"}
            </Typography>
            <TextField value={record?.anoFabricacao} />
          </Box>
          
          <Box className={styles.detailItem}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {"Capacidade"}
            </Typography>
            <TextField value={record?.capacidade} />
          </Box>
          
          <Box className={styles.detailItem}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {"Status"}
            </Typography>
            <TextField value={statusMaquina(record?.status)} />
          </Box>
          
          <Box className={styles.detailItem}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {"Horas de Uso"}
            </Typography>
            <TextField value={record?.horasUso} />
          </Box>
          
          <Box className={styles.detailItem}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {"Setor"}
            </Typography>
            <TextField value={record?.setor?.nome || 'Não informado'} />
          </Box>
        </Box>
      </Stack>
    </Show>
  );
}
