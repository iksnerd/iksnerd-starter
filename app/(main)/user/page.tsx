"use client";
import {
  useUpdateUser,
  useUserData,
} from "@/hooks/repository-hooks/user/use-user";
import { UserForm } from "@/components/forms/user-form";
import { toast } from "sonner";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { serviceHost } from "@/services";

const emailService = serviceHost.getEmailService();

export default function UserPage() {
  const updateUser = useUpdateUser();
  const userData = useUserData("user-id");

  useEffect(() => {
    if (updateUser.isSuccess) {
      toast.success("User Updated");
    }

    if (updateUser.isError) {
      toast.error("Error Updating user");
    }
  }, [updateUser.isError, updateUser.isSuccess]);

  const sendEmail = async () => {
    await emailService.sendEmail({
      firstName: "Ivan Petrov",
    });
  };

  if (userData.isLoading) {
    return <div>Loading...</div>;
  }

  if (userData.isError && userData.error) {
    return <div>Error: {updateUser.error?.message}</div>;
  }

  if (!userData.data) {
    return <div>No data</div>;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Button onClick={sendEmail}>Send Email</Button>

      <UserForm
        onSubmitAction={(data) =>
          updateUser.mutate({
            id: "user-id",
            data: {
              name: data.name,
              email: data.email,
            },
          })
        }
        isLoading={updateUser.isPending}
        isError={updateUser.isError}
        isSuccess={updateUser.isSuccess}
        defaultValues={{
          name: userData.data.name,
          email: userData.data.email,
        }}
      />
    </div>
  );
}
