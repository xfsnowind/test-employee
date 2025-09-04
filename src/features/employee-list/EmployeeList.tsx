import { useMemo } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useSearchParams } from 'react-router-dom';
import { match } from 'ts-pattern';
import { DateTime } from 'luxon';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEmployeesQuery } from '../../api/queries';
import AddEmployeeDrawer from './AddEmployeeDrawer';
import EditEmployeeDrawer from './EditEmployeeDrawer';
import { Employee } from '../../lib/indexedDb';
import { useDeleteEmployeeMutation } from '../../api/mutations';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function EmployeeList() {
  const { data = [], isLoading } = useEmployeesQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const deleteMutation = useDeleteEmployeeMutation();

  const employeeStatus:
    | { type: 'add' }
    | { type: 'edit'; id: string }
    | { type: 'delete'; id: string; name?: string }
    | null = useMemo(() => {
    const type = searchParams.get('type');
    if (type === 'add') return { type: 'add' };
    if (type === 'edit') {
      const id = searchParams.get('id');
      if (id) return { type: 'edit', id };
    }
    if (type === 'delete') {
      const id = searchParams.get('id');
      const name = searchParams.get('name') ?? undefined;
      if (id) return { type: 'delete', id, name };
    }
    return null;
  }, [searchParams]);

  const handleDeleteClick = (id: string, name?: string) => {
    setSearchParams({ type: 'delete', id, name: name ?? '' });
  };

  const handleConfirmDelete = (id: string) => {
    if (!employeeStatus) return;
    deleteMutation.mutate(id, {
      onSettled: () => {
        setSearchParams();
      },
    });
  };

  const handleCancelDelete = () => {
    setSearchParams();
  };

  const handleEditClick = (id: string) => {
    setSearchParams({ type: 'edit', id });
  };

  const columns: GridColDef<Employee>[] = [
    { field: 'firstName', headerName: 'First name', flex: 1 },
    { field: 'lastName', headerName: 'Last name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    {
      field: 'dateOfBirth',
      headerName: 'Date of Birth',
      flex: 1.5,
      renderCell: ({ value }) => DateTime.fromJSDate(value).toFormat('DD'),
    },
    {
      field: 'joinedDate',
      headerName: 'Joined Date',
      flex: 1.5,
      renderCell: ({ value }) => DateTime.fromJSDate(value).toFormat('DD'),
    },
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
            onClick={() => handleEditClick(id)}
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
        showToolbar
        slotProps={{
          loadingOverlay: {
            variant: 'linear-progress',
            noRowsVariant: 'skeleton',
          },
        }}
        pageSizeOptions={[5, 10, 25]}
      />
      {match(employeeStatus)
        .with({ type: 'add' }, () => <AddEmployeeDrawer />)
        .with({ type: 'edit' }, ({ id }) => <EditEmployeeDrawer id={id} />)
        .with({ type: 'delete' }, ({ id, name }) => (
          <ConfirmDialog
            message={`Are you sure you want to delete ${name ?? 'this employee'}? This action cannot be undone.`}
            title="Confirm delete"
            onCancel={handleCancelDelete}
            onConfirm={() => handleConfirmDelete(id)}
            loading={deleteMutation.isPending}
          />
        ))
        .otherwise(() => null)}
    </Box>
  );
}
