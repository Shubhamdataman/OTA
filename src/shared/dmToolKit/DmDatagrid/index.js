import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  Grid,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const DMDataGrid = ({
  columns,
  rows,
  actions,
  onRowClick,
  onRowSelectionModelChange,
}) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const isMobile = useMediaQuery('(max-width: 768px)');

  const handlePaginationChange = (newModel) => {
    setPaginationModel(newModel);
  };

  const handleRowSelection = (selectionModel) => {
    if (onRowSelectionModelChange) {
      onRowSelectionModelChange(selectionModel);
    }
  };

  const enhancedColumns = actions
    ? [
        ...columns,
        {
          field: 'actions',
          headerName: 'Actions',
          flex: 1,
          renderCell: (params) => (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {actions.map((action, index) => (
                <IconButton
                  key={index}
                  onClick={() => action.onClick(params.row)}
                  disabled={action.disabled?.(params.row)}
                >
                  {action.icon}
                </IconButton>
              ))}
            </Box>
          ),
        },
      ]
    : columns;

  return (
    <Box className="dmDataGridContainer">
      {/* {isMobile ? (
        <Box className="dmMobileDataGridBox">
          {rows.map((row) => (
            <Card
              className="dmMobileDataGridCardContainer"
              sx={{
                boxShadow: 3,
                cursor: onRowClick ? 'pointer' : 'default',
              }}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns
                .filter((col) => col.field !== 'actions')
                .map((col) => (
                  <Box className="dmMobileDataGridCardBox">
                    <Typography sx={{ fontSize: 8, color: '#779CAB' }}>
                      {col.headerName}
                    </Typography>
                    <Typography sx={{ fontSize: 10 }}>
                      {row[col.field]}
                    </Typography>
                  </Box>
                ))}
              {actions && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {actions.map((action, index) => (
                    <IconButton
                      key={index}
                      onClick={() => action.onClick(row)}
                      disabled={action.disabled?.(row)}
                    >
                      {action.icon}
                    </IconButton>
                  ))}
                </Box>
              )}
            </Card>
          ))}
        </Box>
      ) : ( */}
      <DataGrid
        rows={rows}
        columns={enhancedColumns}
        getRowId={(row) => row.id}
        onRowClick={(params) => onRowClick && onRowClick(params.row)}
        onRowSelectionModelChange={handleRowSelection}
        rowHeight={40}
        columnHeaderHeight={35}
        hideFooter
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
        }
        sx={{
          borderTop: 'none',
          borderRight: 'none',
          borderLeft: 'none',
          borderRadius: 0,
          backgroundColor: 'background.default',
          '& .MuiDataGrid-columnHeaders': {
            borderBottom: '1px solid #ccc',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
            fontSize: 10,
            color: 'primary.main',
          },
          '& .MuiDataGrid-cell': {
            fontSize: 10,
            display: 'flex',
            alignItems: 'center',
            borderColor: 'transparent !important',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'action.hover',
          },
          '& .even-row': {
            backgroundColor: 'background.fourth',
          },
          '& .odd-row': {
            backgroundColor: 'background.fifth',
          },
          '& .MuiDataGrid-footerContainer': {
            minHeight: 32,
            maxHeight: 32,
            fontSize: 8,
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiTablePagination-root': {
            fontSize: 10,
          },
          '& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel':
            {
              fontSize: 10,
            },
          '& .MuiTablePagination-select': {
            fontSize: 10,
            padding: '0px 8px !important',
            minHeight: '10px',
          },
          '& .MuiSvgIcon-root': {
            fontSize: 14,
          },
          '& .MuiDataGrid-columnSeparator': {
            display: 'none !important',
          },
          '& .MuiDataGrid-columnHeaders': {
            borderRight: 'none !important',
          },
        }}
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        disableColumnResize
        disableColumnSorting
        slots={{
          noRowsOverlay: () => (
            <Box
              sx={{
                height: '100%',
                backgroundColor: 'background.default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography fontSize="0.8rem">No data yet.</Typography>
            </Box>
          ),
        }}
      />

      {/* )} */}
    </Box>
  );
};

export default DMDataGrid;
