import {
  Drawer,
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';

import { useForm } from '@tanstack/react-form';
import { useNavigate } from 'react-router-dom';
import {
  employeeFormSchema,
  GENDER_VALUES,
  type EmployeeFormValues,
} from '../../lib/employee.constants';
import { useAddEmployeeMutation } from '../../api/mutations';

export default function AddEmployeeDrawer() {
  const navigate = useNavigate();
  const addMutation = useAddEmployeeMutation();

  const form = useForm({
    validators: {
      onChange: employeeFormSchema,
    },
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: 'male',
      dateOfBirth: new Date(),
      joinedDate: new Date(),
    },
    onSubmit: ({ value }) => {
      addMutation.mutate(value as EmployeeFormValues, {
        onSuccess: () => {
          handleClose();
        },
      });
    },
  });

  const handleClose = () => {
    navigate({ search: '' });
  };

  return (
    <Drawer
      anchor="right"
      open
      onClose={handleClose}
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

        <Stack spacing={2}>
          <form.Field
            name="firstName"
            children={(field) => (
              <TextField
                label="First name"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                error={field.state.meta.errors.length > 0}
                helperText={field.state.meta.errors[0]?.message ?? ''}
                sx={{ '& .MuiFormHelperText-root': { color: 'red' } }}
              />
            )}
          />
          <form.Field
            name="lastName"
            children={(field) => (
              <TextField
                label="Last name"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                error={field.state.meta.errors.length > 0}
                helperText={field.state.meta.errors[0]?.message ?? ''}
                sx={{ '& .MuiFormHelperText-root': { color: 'red' } }}
              />
            )}
          />

          <form.Field
            name="email"
            children={(field) => (
              <TextField
                label="Email"
                type="email"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                error={field.state.meta.errors.length > 0}
                helperText={field.state.meta.errors[0]?.message ?? ''}
                sx={{ '& .MuiFormHelperText-root': { color: 'red' } }}
              />
            )}
          />
          <form.Field
            name="phone"
            children={(field) => (
              <TextField
                label="Phone"
                type="tel"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                error={field.state.meta.errors.length > 0}
                helperText={field.state.meta.errors[0]?.message ?? ''}
                sx={{ '& .MuiFormHelperText-root': { color: 'red' } }}
              />
            )}
          />

          <Box>
            <Typography
              variant="body2"
              sx={{ mb: 1 }}
            >
              Gender
            </Typography>
            <form.Field
              name="gender"
              children={(field) => (
                <RadioGroup
                  row
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  {GENDER_VALUES.map((g) => (
                    <FormControlLabel
                      key={g}
                      value={g}
                      control={<Radio />}
                      label={g}
                    />
                  ))}
                </RadioGroup>
              )}
            />
          </Box>

          <form.Field
            name="dateOfBirth"
            children={(field) => (
              <DatePicker
                label="Date of Birth"
                value={
                  field.state.value ? DateTime.fromJSDate(field.state.value) : null
                }
                onChange={(dt) => field.handleChange(dt ? dt.toJSDate() : null)}
                slotProps={{
                  textField: {
                    error: field.state.meta.errors.length > 0,
                    helperText: field.state.meta.errors[0]?.message ?? '',
                  },
                }}
              />
            )}
          />

          <form.Field
            name="joinedDate"
            children={(field) => (
              <DatePicker
                label="Joined Date"
                value={
                  field.state.value ? DateTime.fromJSDate(field.state.value) : null
                }
                onChange={(dateValue) =>
                  field.handleChange(dateValue ? dateValue.toJSDate() : null)
                }
                slotProps={{
                  textField: {
                    error: field.state.meta.errors.length > 0,
                    helperText: field.state.meta.errors[0]?.message ?? '',
                  },
                }}
              />
            )}
          />

          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            sx={{ mt: 2 }}
          >
            <Button
              onClick={handleClose}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit}
              variant="contained"
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
}
