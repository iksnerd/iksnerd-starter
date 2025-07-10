import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { serviceHost } from "@/services";
import { repositoryHost } from "@/repositories";
import { SetPayload, UpdatePayload, UserChatData } from "@/core";
import { useUser } from "@clerk/nextjs";

const databaseService = serviceHost.getDatabaseClientService();
const userRepository = repositoryHost.getUserChatRepository(databaseService);

export const useUserChatData = (id: string) => {
  const { user } = useUser();
  if (!user) {
    throw new Error("User is not authenticated");
  }
  return useQuery({
    queryKey: ["userChat", id],
    queryFn: () =>
      userRepository.get({
        id: id,
        userId: user?.id, // Assuming userId is the same as id for this query
      }),
    enabled: !!id || id !== "",
  });
};

export const useChatHistory = () => {
  const { user, isLoaded } = useUser();

  return useQuery({
    queryKey: ["userChat", "history"],
    queryFn: () =>
      userRepository.getAll({
        userId: user?.id || "", // Ensure userId is provided
      }),
    enabled: !!user?.id && isLoaded, // Only run query if user is loaded and has an ID
  });
};

export const useUserChatUpdate = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: (update: UpdatePayload<UserChatData>) =>
      userRepository.update({
        ...update,
        userId: user?.id || "", // Ensure userId is provided
      }),
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["userChat", variables.id],
      });
    },
  });
};

export const useUserChatCreate = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  if (!user) {
    throw new Error("User is not authenticated");
  }
  return useMutation({
    mutationFn: (set: SetPayload<UserChatData>) =>
      userRepository.create({
        ...set,
        userId: user.id,
      }),
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["userChat", variables.data.id],
      });
    },
  });
};

export const useUserChatDelete = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  if (!user) {
    throw new Error("User is not authenticated");
  }
  return useMutation({
    mutationFn: (payload: { id: string }) =>
      userRepository.delete({
        id: payload.id,
        userId: user.id,
      }),
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["userChat", variables.id],
      });
    },
  });
};
