import { z } from 'zod';

// Validation constraints
export const NAME_MIN_LENGTH = 6;
export const NAME_MAX_LENGTH = 10;

// Singapore phone number: optional +65 or 65 prefix, then 8 digits starting with 6,8 or 9
export const SINGAPORE_PHONE_REGEX = /^(?:\+65|65)?\s*[6894]\d{7}$/;

export const GENDER_VALUES = ['male', 'female', 'other'] as const;

export const employeeFormSchema = z
  .object({
    firstName: z
      .string()
      .min(NAME_MIN_LENGTH, {
        message: `First name must be at least ${NAME_MIN_LENGTH} characters`,
      })
      .max(NAME_MAX_LENGTH, {
        message: `First name must be at most ${NAME_MAX_LENGTH} characters`,
      }),
    lastName: z
      .string()
      .min(NAME_MIN_LENGTH, {
        message: `Last name must be at least ${NAME_MIN_LENGTH} characters`,
      })
      .max(NAME_MAX_LENGTH, {
        message: `Last name must be at most ${NAME_MAX_LENGTH} characters`,
      }),
    email: z.email({ message: 'Invalid email address' }),
    phone: z.string().regex(SINGAPORE_PHONE_REGEX, {
      message: 'Invalid Singapore phone number',
    }),
    gender: z.enum(GENDER_VALUES),
    // Coerce incoming values to Date so the schema accepts ISO strings, Date objects, etc.
    dateOfBirth: z.date().refine((date) => date < new Date(), {
      message: 'Date of birth cannot be in the future',
    }),
    joinedDate: z.date(),
  })
  .superRefine((val, ctx) => {
    if (val.joinedDate <= val.dateOfBirth) {
      ctx.addIssue({
        code: 'custom',
        message: 'Joined date must be after Date of Birth',
        path: ['joinedDate'],
      });
    }
  });

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export type EmployeeFormPossibleValues = Omit<
  EmployeeFormValues,
  'dateOfBirth' | 'joinedDate'
> & {
  dateOfBirth: Pick<EmployeeFormValues, 'dateOfBirth'> | null;
  joinedDate: Pick<EmployeeFormValues, 'joinedDate'> | null;
};

export const UnsavedChangesMessage =
  'Form has been modified. You will lose your unsaved changes. Are you sure you want to close this form?';
