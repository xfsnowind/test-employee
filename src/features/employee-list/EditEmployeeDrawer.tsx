import { Drawer, Box, Typography, CircularProgress } from '@mui/material';
import { isEmpty } from 'lodash';
import { match } from 'ts-pattern';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { type EmployeeFormValues } from '../../lib/employee.constants';
import { useUpdateEmployeeMutation } from '../../api/mutations';
import { useFetchEmployeeDetailQuery } from '../../api/queries';
import EmployeeForm from '../../components/EmployeeForm';

export default function EditEmployeeDrawer({ id }: { id?: string }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idFromUrl = searchParams.get('id');
  const employeeId = (id || idFromUrl) ?? '';

  const query = useFetchEmployeeDetailQuery(employeeId);
  const handleClose = () => {
    navigate({ search: '' });
  };

  return (
    <Drawer
      anchor="right"
      open
      onClose={handleClose}
      data-testid="EditEmployeeDrawer"
    >
      <Box
        sx={{ width: 480, p: 3 }}
        role="dialog"
        aria-label="Edit employee"
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          Edit Employee
        </Typography>
        {match(query)
          .with({ status: 'success' }, ({ data }) =>
            isEmpty(data) ? (
              <Typography>Employee not found.</Typography>
            ) : (
              <EditEmployeeDrawerContent
                employee={data}
                employeeId={employeeId}
                handleClose={handleClose}
              />
            ),
          )
          .with({ status: 'pending' }, () => <CircularProgress />)
          .with({ status: 'error' }, () => (
            <Typography
              color="error"
              sx={{ p: 2 }}
            >
              Error loading employee data. Please try again.
            </Typography>
          ))
          .exhaustive()}
      </Box>
    </Drawer>
  );
}

function EditEmployeeDrawerContent({
  employee,
  employeeId,
  handleClose,
}: {
  employee: EmployeeFormValues;
  employeeId: string;
  handleClose: () => void;
}) {
  const updateMutation = useUpdateEmployeeMutation();

  const handleSubmit = (values: EmployeeFormValues) => {
    if (!employeeId) return;

    updateMutation.mutate(
      { id: employeeId, data: values },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  return (
    <EmployeeForm
      initialValues={employee}
      onSubmit={handleSubmit}
      onCancel={handleClose}
      submitButtonText="Update"
      isSubmitting={updateMutation.isPending}
    />
  );
}
