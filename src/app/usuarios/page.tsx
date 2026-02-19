"use client";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";
import { LoadingOverlay } from "@/components/LoadingOverlay";

export default function UsuariosList() {
  const { dataGridProps } = useDataGrid({});

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "nome",
        flex: 1,
        headerName: "Nome",
        minWidth: 200,
        display: "flex",
        renderCell: function render({ row }) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {row.photo_profile ? (
                <img 
                  src={row.photo_profile} 
                  alt={row.nome}
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  backgroundColor: '#ccc', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>
                  {row.nome?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <span>{row.nome}</span>
            </div>
          );
        },
      },
      {
        field: "email",
        flex: 1,
        headerName: "Email",
        minWidth: 200,
        display: "flex",
      },
      {
        field: "cargo",
        flex: 1,
        headerName: "Cargo",
        minWidth: 100,
        display: "flex",
      },
      {
        field: "nomeSetor",
        flex: 1,
        headerName: "Setor",
        minWidth: 100,
        display: "flex",
        renderCell: function render({ row }) {
          return row.nomeSetor;
        },
      },
      {
        field: "actions",
        headerName: "Ações",
        align: "right",
        headerAlign: "right",
        minWidth: 120,
        sortable: false,
        display: "flex",
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton 
                hideText 
                recordItemId={row.id}
                confirmTitle={`Confirmar Exclusão de "${row.nome}"`}
                confirmOkText="Sim, Excluir"
                confirmCancelText="Cancelar"
              />
            </>
          );
        },
      },
    ],
    []
  );

  return (
    <List>
      <LoadingOverlay 
        isLoading={dataGridProps.loading}
        message="Carregando..."
        subMessage="Buscando dados da API"
      />
      <DataGrid {...dataGridProps} columns={columns} />
    </List>
  );
}
