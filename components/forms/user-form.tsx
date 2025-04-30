'use client';

import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { userDataSchema } from '@/core';
import { Loader } from '@/components/shared/loader';
import { useUserForm } from '@/hooks/forms/user';

interface UserFormProps {
  onSubmitAction: (values: z.infer<typeof userDataSchema>) => void;
  defaultValues?: z.infer<typeof userDataSchema>;
  isLoading?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
}


export function UserForm ({
                            onSubmitAction,
                            defaultValues,
                            isLoading
                            // isError,
                            // isSuccess
                          }: UserFormProps) {
  
  const form = useUserForm({
    defaultValues
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitAction)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Ivan Petrov" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="info@example.com" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button
          disabled={isLoading}
          type="submit">
          {isLoading ? <Loader/> : ''}
          Submit
        </Button>
      </form>
    </Form>
  );
}
