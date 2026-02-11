import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export interface CustomCreditCard {
  identifier: string;
  qrPayload: string;
}

export function useCustomCreditCards() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const addCardMutation = useMutation({
    mutationFn: async ({ identifier, qrPayload }: { identifier: string; qrPayload: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addCustomCreditCard(identifier, qrPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customCreditCards'] });
    },
  });

  const validateCardMutation = useMutation({
    mutationFn: async (qrPayload: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.validateCustomCreditCard(qrPayload);
    },
  });

  return {
    addCard: addCardMutation.mutateAsync,
    isAddingCard: addCardMutation.isPending,
    validateCard: validateCardMutation.mutateAsync,
    isValidating: validateCardMutation.isPending,
  };
}
