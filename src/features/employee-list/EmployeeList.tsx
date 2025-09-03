import React from 'react';
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEmployees, Employee } from './queries';
import { deleteEmployee } from '../../lib/indexedDb';

export default function EmployeeList() {
  const { data = [], isLoading, refetch } = useEmployees();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    await deleteEmployee(id);
    refetch();
  };

  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First name', flex: 1 },
    { field: 'lastName', headerName: 'Last name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'gender', headerName: 'Gender', width: 110 },
    { field: 'dateOfBirth', headerName: 'Date of Birth', flex: 1 },
    { field: 'joinedDate', headerName: 'Joined Date', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const id = params.row.id as string;
        return (
          <Stack
            direction="row"
            spacing={1}
          >
            <IconButton
              size="small"
              aria-label="edit"
              title="Edit"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              aria-label="delete"
              title="Delete"
              onClick={() => handleDelete(id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  // DataGrid expects rows with id field
  const rows: Employee[] = (data || []).map((r) => ({ ...r }));

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ flexGrow: 1 }}
        >
          Employee Form
        </Typography>
        <Button variant="contained">Add Employee</Button>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        slotProps={{
          loadingOverlay: {
            variant: 'linear-progress',
            noRowsVariant: 'skeleton',
          },
        }}
        pageSizeOptions={[5, 10, 25]}
      />
    </Box>
  );
}
