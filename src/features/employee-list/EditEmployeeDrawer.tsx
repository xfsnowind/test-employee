import { useState } from 'react';
import { Drawer, Box, Typography, CircularProgress } from '@mui/material';
import { isEmpty } from 'lodash';
import { match } from 'ts-pattern';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  UnsavedChangesMessage,
  type EmployeeFormValues,
} from '../../lib/employee.constants';
import { useUpdateEmployeeMutation } from '../../api/mutations';
import { useFetchEmployeeDetailQuery } from '../../api/queries';
import EmployeeForm from '../../components/EmployeeForm';
import ConfirmDialog from '../../components/ConfirmDialog';

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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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

  const handleCancel = (isDirty: boolean) => {
    if (isDirty) {
      setShowConfirmDialog(true);
    } else {
      handleClose();
    }
  };

  const handleConfirm = () => {
    setShowConfirmDialog(false);
    handleClose();
  };

  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <EmployeeForm
        initialValues={employee}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitButtonText="Update"
        isSubmitting={updateMutation.isPending}
      />
      {showConfirmDialog && (
        <ConfirmDialog
          title="Confirm Close"
          message={UnsavedChangesMessage}
          onCancel={handleCancelConfirm}
          onConfirm={handleConfirm}
          cancelLabel="Stay"
          confirmLabel="OK"
        />
      )}
    </>
  );
}
