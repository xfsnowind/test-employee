import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useSearchParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEmployeesQuery } from '../../api/queries';
import AddEmployeeDrawer from './AddEmployeeDrawer';
import { Employee } from '../../lib/indexedDb';

export default function EmployeeList() {
  const { data = [], isLoading } = useEmployeesQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const showAdd = searchParams.get('type') === 'add';

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
        return [
          <IconButton
            size="small"
            aria-label="edit"
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>,
          <IconButton
            size="small"
            aria-label="delete"
            title="Delete"
            // onClick={() => handleDelete(id)}
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
      {showAdd && <AddEmployeeDrawer />}
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
    </Box>
  );
}
