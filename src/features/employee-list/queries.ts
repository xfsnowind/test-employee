import { useQuery } from '@tanstack/react-query';
import { listEmployees } from '../../lib/indexedDb';

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  joinedDate: string;
};

export const EMPLOYEES_QUERY_KEY = ['employees'] as const;

export function useEmployees() {
  return useQuery<Employee[], Error>({
    queryKey: EMPLOYEES_QUERY_KEY,
    queryFn: async () => {
      const items = await listEmployees();
      return (items ?? []) as Employee[];
    },
  });
}
