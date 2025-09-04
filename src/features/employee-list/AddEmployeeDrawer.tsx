import { Drawer, Box, Typography } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { type EmployeeFormValues } from '../../lib/employee.constants';
import { useAddEmployeeMutation } from '../../api/mutations';
import EmployeeForm from '../../components/EmployeeForm';

export default function AddEmployeeDrawer() {
  const navigate = useNavigate();
  const addMutation = useAddEmployeeMutation();

  const handleClose = () => {
    navigate({ search: '' });
  };

  const handleSubmit = (values: EmployeeFormValues) => {
    addMutation.mutate(values, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <Drawer
      anchor="right"
      open
      onClose={handleClose}
      data-testid="AddEmployeeDrawer"
    >
      <Box
        sx={{ width: 480, p: 3 }}
        role="dialog"
        aria-label="Add employee"
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          Add Employee
        </Typography>

        <EmployeeForm
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            gender: 'male',
            dateOfBirth: new Date(),
            joinedDate: new Date(),
          }}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          submitButtonText="Submit"
          isSubmitting={addMutation.isPending}
        />
      </Box>
    </Drawer>
  );
}
