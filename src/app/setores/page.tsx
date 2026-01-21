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

export default function SetoresList() {
  const { dataGridProps } = useDataGrid({});

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
        field: "created_at",
        headerName: "Criado em",
        minWidth: 200,
        display: "flex",
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
