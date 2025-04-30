import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { serviceHost } from '@/services';
import { repositoryHost } from '@/repositories';
import { SetPayload, UpdatePayload, User, UserData } from '@/core';

const databaseService = serviceHost.getDatabaseClientService();
const userRepository = repositoryHost.getUserRepository(databaseService);

export const useUserData = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userRepository.get(id),
    enabled: !!id || id !== ''
  });
};

export const useOrgMembers = (orgId: string) => {
  return useQuery({
    queryKey: ['orgMembers', orgId],
    queryFn: () => userRepository.getOrgMembers(orgId),
    enabled: !!orgId || orgId !== ''
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: SetPayload<User>) =>
      userRepository.create(payload),
    onSettled: async (data, error, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['user', variables.id]
      });
    }
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: UpdatePayload<UserData>) =>
      userRepository.update(payload),
    onSettled: async (data, error, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['user', variables.id]
      });
    }
  });
};
