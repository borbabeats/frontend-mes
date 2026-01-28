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
import statusMaquina from "@utils/status_maquina";

export default function MaquinasList() {
  const { dataGridProps } = useDataGrid({});

  const statusColors: Record<string, string> = {
    "Disponível": "blue",
    "Em Uso": "green",
    "Manutenção": "orange",
    "Inativa": "red",
    "Parada": "red",
    "Desativada": "purple"
  }

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        type: "number",
        minWidth: 50,
        display: "flex",
        align: "left",
        headerAlign: "left",
      },
      {
        field: "nome",
        flex: 1,
        headerName: "Nome",
        minWidth: 200,
        display: "flex",
      },
      {
        field: "setor",
        headerName: "Setor",
        minWidth: 200,
        display: "flex",
        renderCell: function render({ row }) {
          return (
            <div>
              {row.setor?.nome || "Não informado"}
            </div>
          );
        },
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 100,
        display: "flex",
        renderCell: function render({ row }) {
          return (
            <div style={{ color: statusColors[statusMaquina(row.status)] }}>
              {statusMaquina(row.status)}
            </div>
          );
        },
      },
      {
        field: "created_at",
        headerName: "Criado em",
        minWidth: 150,
        display: "flex",
        renderCell: function render({ value }) {
          if (!value) return "Não informado";
          return new Date(value).toLocaleDateString("pt-BR");
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
      <DataGrid {...dataGridProps} columns={columns} />
    </List>
  );
}
