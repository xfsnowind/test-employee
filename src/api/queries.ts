import { useQuery } from '@tanstack/react-query';
import { Employee, listEmployees } from '../lib/indexedDb';

export const EMPLOYEES_QUERY_KEY = ['employees'] as const;

export function useEmployeesQuery() {
  return useQuery<Employee[], Error>({
    queryKey: EMPLOYEES_QUERY_KEY,
    queryFn: () => listEmployees(),
  });
}
