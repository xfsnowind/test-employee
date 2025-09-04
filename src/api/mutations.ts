import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addEmployee, deleteEmployee, updateEmployee } from '../lib/indexedDb';
import { EMPLOYEES_QUERY_KEY } from './queries';
import { EmployeeFormValues } from '../lib/employee.constants';

export function useAddEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addEmployee,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
    },
  });
}

export function useDeleteEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
    },
  });
}

export function useUpdateEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeFormValues }) =>
      updateEmployee(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
    },
  });
}
