import {
  Box,
  TextField,
  Stack,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  styled,
  Typography,
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';

import { useForm } from '@tanstack/react-form';
import {
  EmployeeFormPossibleValues,
  employeeFormSchema,
  GENDER_VALUES,
  type EmployeeFormValues,
} from '../lib/employee.constants';

interface EmployeeFormProps {
  initialValues: EmployeeFormValues;
  onSubmit: (values: EmployeeFormValues) => void;
  onCancel: () => void;
  submitButtonText?: string;
  isSubmitting?: boolean;
}

export default function EmployeeForm({
  initialValues,
  onSubmit,
  onCancel,
  submitButtonText = 'Submit',
  isSubmitting = false,
}: EmployeeFormProps) {
  const form = useForm({
    validators: {
      onChange: employeeFormSchema,
    },
    defaultValues: initialValues,
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <Stack spacing={2}>
      <form.Field
        name="firstName"
        children={(field) => (
          <StyledTextField
            label="First name"
            value={field.state.value}
            onChange={(event) => field.handleChange(event.target.value)}
            error={field.state.meta.errors.length > 0}
            helperText={field.state.meta.errors[0]?.message ?? ''}
          />
        )}
      />
      <form.Field
        name="lastName"
        children={(field) => (
          <StyledTextField
            label="Last name"
            value={field.state.value}
            onChange={(event) => field.handleChange(event.target.value)}
            error={field.state.meta.errors.length > 0}
            helperText={field.state.meta.errors[0]?.message ?? ''}
          />
        )}
      />

      <form.Field
        name="email"
        children={(field) => (
          <StyledTextField
            label="Email"
            type="email"
            value={field.state.value}
            onChange={(event) => field.handleChange(event.target.value)}
            error={field.state.meta.errors.length > 0}
            helperText={field.state.meta.errors[0]?.message ?? ''}
          />
        )}
      />
      <form.Field
        name="phone"
        children={(field) => (
          <StyledTextField
            label="Phone"
            type="tel"
            value={field.state.value}
            onChange={(event) => field.handleChange(event.target.value)}
            error={field.state.meta.errors.length > 0}
            helperText={field.state.meta.errors[0]?.message ?? ''}
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
              onChange={(e) =>
                field.handleChange(e.target.value as EmployeeFormValues['gender'])
              }
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
            value={field.state.value ? DateTime.fromJSDate(field.state.value) : null}
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
            value={field.state.value ? DateTime.fromJSDate(field.state.value) : null}
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
        justifyContent="space-between"
        sx={{ mt: 2 }}
      >
        <Button
          onClick={onCancel}
          variant="outlined"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={form.handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          {submitButtonText}
        </Button>
      </Stack>
    </Stack>
  );
}

const StyledTextField = styled(TextField)({
  '& .MuiFormHelperText-root': { color: 'red' },
});
