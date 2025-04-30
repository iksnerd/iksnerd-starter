import { zodResolver } from '@hookform/resolvers/zod';
import type { UseFormProps } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { UserData, userDataSchema } from '@/core';

export function useUserForm(props: UseFormProps<UserData>) {
  return useForm<UserData>({
    ...props,
    resolver: zodResolver(userDataSchema),
    mode: 'onChange',
  });
}
