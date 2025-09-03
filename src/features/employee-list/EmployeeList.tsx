import { Box, Button, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useSearchParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEmployeesQuery } from '../../api/queries';
import AddEmployeeDrawer from './AddEmployeeDrawer';
import { Employee } from '../../lib/indexedDb';
import { useDeleteEmployeeMutation } from '../../api/mutations';
import { useState } from 'react';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function EmployeeList() {
  const { data = [], isLoading } = useEmployeesQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const showAdd = searchParams.get('type') === 'add';
  const deleteMutation = useDeleteEmployeeMutation();

  const [toDelete, setToDelete] = useState<{ id: string; name?: string } | null>(null);

  const handleDeleteClick = (id: string, name?: string) => {
    setToDelete({ id, name });
  };

  const handleConfirmDelete = () => {
    if (!toDelete) return;
    deleteMutation.mutate(toDelete.id, {
      onSettled: () => {
        setToDelete(null);
      },
    });
  };

  const handleCancelDelete = () => {
    setToDelete(null);
  };

  const columns: GridColDef<Employee>[] = [
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
        const name = (
          (params.row.firstName ?? '') +
          ' ' +
          (params.row.lastName ?? '')
        ).trim();
        return [
          <IconButton
            key="edit"
            size="small"
            aria-label="edit"
            title="Edit"
            onClick={() => {}} // TODO:
          >
            <EditIcon fontSize="small" />
          </IconButton>,
          <IconButton
            key="delete"
            size="small"
            aria-label="delete"
            title="Delete"
            onClick={() => handleDeleteClick(id, name)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>,
        ];
      },
    },
  ];

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
        <Button
          variant="contained"
          onClick={() => setSearchParams({ type: 'add' })}
        >
          Add Employee
        </Button>
      </Box>
      <DataGrid
        rows={data}
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
      {showAdd && <AddEmployeeDrawer />}
      {toDelete && (
        <ConfirmDialog
          message={`Are you sure you want to delete ${toDelete?.name ? toDelete.name : 'this employee'}? This action cannot be undone.`}
          title="Confirm delete"
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          loading={deleteMutation.isPending}
        />
      )}
    </Box>
  );
}
