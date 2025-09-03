import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addEmployee } from '../lib/indexedDb';
import { EMPLOYEES_QUERY_KEY } from './queries';

export function useAddEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addEmployee,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
    },
  });
}
