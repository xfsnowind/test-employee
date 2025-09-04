import { useQuery } from '@tanstack/react-query';
import { Employee, listEmployees, getEmployee } from '../lib/indexedDb';

export const EMPLOYEES_QUERY_KEY = ['employees'] as const;
export const EMPLOYEE_QUERY_KEY = (id: string) => ['employee', id] as const;

export function useEmployeesQuery() {
  return useQuery<Employee[], Error>({
    queryKey: EMPLOYEES_QUERY_KEY,
    queryFn: () => listEmployees(),
  });
}

export function useFetchEmployeeDetailQuery(id: string) {
  return useQuery<Employee | undefined, Error>({
    queryKey: EMPLOYEE_QUERY_KEY(id),
    queryFn: () => getEmployee(id),
  });
}
