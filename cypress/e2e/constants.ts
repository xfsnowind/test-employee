import { DateTime } from 'luxon';

export const mockEmployee = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '91234567',
  gender: 'male' as const,
  dateOfBirth: DateTime.fromFormat('1990-01-01', 'yyyy-MM-dd').toJSDate(),
  joinedDate: DateTime.fromFormat('2020-01-01', 'yyyy-MM-dd').toJSDate(),
};

export const mockEmployee2 = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
  phone: '98765432',
  gender: 'female' as const,
  dateOfBirth: DateTime.fromFormat('1995-05-15', 'yyyy-MM-dd').toJSDate(),
  joinedDate: DateTime.fromFormat('2021-06-30', 'yyyy-MM-dd').toJSDate(),
};
