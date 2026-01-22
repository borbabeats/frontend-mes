"use client";

import { Stack, Typography, Box, Avatar, Divider, Chip } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import styles from "./show.module.scss";
import statusMaquina from "@utils/status_maquina";

export default function SetorShow() {
  const { query } = useShow({});
  const { data, isLoading } = query;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={3}>
        {/* Header com informações principais do setor */}
        <Box className={styles.userHeader}>
          <Avatar
            className={styles.avatar}
            sx={{ bgcolor: 'primary.main' }}
          >
            {record?.nome?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4">{record?.nome}</Typography>
            <Typography variant="h6" color="text.secondary">
              Setor #{record?.id}
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
              {"Nome do Setor"}
            </Typography>
            <TextField value={record?.nome} />
          </Box>
          
          <Box className={styles.detailItem}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {"Data de Criação"}
            </Typography>
            <TextField value={record?.created_at ? new Date(record.created_at).toLocaleDateString('pt-BR') : 'Não informado'} />
          </Box>
          
          <Box className={styles.detailItem}>
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {"Última Atualização"}
            </Typography>
            <TextField value={record?.updated_at ? new Date(record.updated_at).toLocaleDateString('pt-BR') : 'Não informado'} />
          </Box>
        </Box>

        <Divider />

        {/* Usuários do Setor */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Usuários do Setor ({record?.usuarios?.length || 0})
          </Typography>
          <Box className={styles.detailsContainer}>
            {record?.usuarios?.length > 0 ? (
              record.usuarios.map((usuario: any) => (
                <Box key={usuario.id} className={styles.detailItem}>
                  <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                    {usuario.nome?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="body1" fontWeight="bold">
                      {usuario.nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {usuario.email} • {usuario.cargo}
                    </Typography>
                  </Box>
                  <Chip label={usuario.cargo} size="small" color="primary" />
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">Nenhum usuário encontrado neste setor.</Typography>
            )}
          </Box>
        </Box>

        <Divider />

        {/* Máquinas do Setor */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Máquinas do Setor ({record?.maquinas?.length || 0})
          </Typography>
          <Box className={styles.detailsContainer}>
            {record?.maquinas?.length > 0 ? (
              record?.maquinas.map((maquina: any) => (
                <Box key={maquina.id} className={styles.detailItem}>
                  <Box flex={1}>
                    <Typography variant="body1" fontWeight="bold">
                      {maquina.nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {maquina.id}
                    </Typography>
                  </Box>
                  <Chip 
                    label={statusMaquina(maquina.status)} 
                    size="small" 
                    color={
                      maquina.status === 'DISPONIVEL' ? 'primary' :
                      maquina.status === 'EM_USO' ? 'success' :
                      maquina.status === 'MANUTENCAO' ? 'warning' :
                      maquina.status === 'INATIVA' || maquina.status === 'PARADA' || maquina.status === 'DESATIVADA' ? 'error' : 'default'
                    }
                  />
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">Nenhuma máquina encontrada neste setor.</Typography>
            )}
          </Box>
        </Box>
      </Stack>
    </Show>
  );
}
