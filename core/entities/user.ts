import { z } from 'zod';
import { baseEntitySchema } from '@/core';

export const userDataSchema = z.object({
  name: z.string(),
  email: z.string(),
});

export const userSchema = baseEntitySchema.merge(userDataSchema);

export type UserData = z.infer<typeof userDataSchema>;

export type User = z.infer<typeof userSchema>;
