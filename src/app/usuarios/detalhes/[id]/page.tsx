"use client";

import { Stack, Typography, Box, Avatar } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import styles from "./show.module.scss";

export default function UserShow() {
  const { query } = useShow({});
  const { data, isLoading } = query;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={3}>
        {/* Header com foto e informações principais */}
        <Box className={styles.userHeader}>
          <Avatar
            src={record?.photo_profile}
            className={styles.avatar}
          >
            {record?.nome?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4">{record?.nome}</Typography>
            <Typography variant="h6" color="text.secondary">{record?.cargo}</Typography>
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
              {"Nome"}
            </Typography>
            <TextField value={record?.nome} />
          </Box>
          
          <Box className={styles.detailItem}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {"Email"}
            </Typography>
            <TextField value={record?.email} />
          </Box>
          
          <Box className={styles.detailItem}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {"Telefone"}
            </Typography>
            <TextField value={record?.telefone || 'Não informado'} />
          </Box>
          
          <Box className={styles.detailItem}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {"Cargo"}
            </Typography>
            <TextField value={record?.cargo} />
          </Box>
          
          <Box className={styles.detailItem}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {"Setor"}
            </Typography>
            <TextField value={record?.setor_id?.toString() || 'Não informado'} />
          </Box>
        </Box>
      </Stack>
    </Show>
  );
}
