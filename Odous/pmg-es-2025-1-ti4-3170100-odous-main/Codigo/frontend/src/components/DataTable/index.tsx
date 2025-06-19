import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, GridRowParams } from '@mui/x-data-grid'; // Importar GridRowParams
import Paper from '@mui/material/Paper';

const paginationModel = { page: 0, pageSize: 10 };

type DataTableProps = {
    title: string;
    rows: any[];
    columns: GridColDef[];
    onRowClick?: (row: any) => void;
};

const DataTable = ({ rows: initialRows, columns, onRowClick }: DataTableProps) => {
    const [rows, setRows] = useState(initialRows);
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);

    useEffect(() => {
        setRows(initialRows);
    }, [initialRows]);

    const handleRowClick = (params: GridRowParams) => {
        if (onRowClick) {
            onRowClick(params.row);
        }
    };

    return (
      <Paper sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          onRowSelectionModelChange={(newSelection) =>
            setSelectionModel(newSelection)
          }
          rowSelectionModel={selectionModel}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            cursor: onRowClick ? "pointer" : "default",
            backgroundColor: "var(--datagrid-bg)",
            color: "var(--datagrid-text)",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "var(--datagrid-header-bg)",
              color: "var(--datagrid-header-text)",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "var(--datagrid-header-text)",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-row": {
              backgroundColor: "var(--datagrid-bg)",
              color: "var(--datagrid-text)",
            },
            "& .MuiDataGrid-sortIcon": {
              color: "var(--datagrid-header-text)",
            },
            ".MuiDataGrid-footerContainer": {
              backgroundColor: "var(--datagrid-header-bg)",
              color: "var(--datagrid-text)",
            },
            ".MuiTablePagination-root": {
              backgroundColor: "var(--datagrid-header-bg)",
              color: "var(--datagrid-text)",
            },
            ".MuiDataGrid-row": {
              backgroundColor: "var(--datagrid-bg)",
              color: "var(--datagrid-text)",
            },
          }}
          onRowClick={handleRowClick}
        />
      </Paper>
    );
};

export default DataTable;