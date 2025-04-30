"use client";
import * as React from "react";
import { useEffect } from "react";
import {
  useOnUserStateChange,
  useSignInWithCustomToken,
  useUpdateAuthEmail,
} from "@/hooks";
import { useAuth, useUser } from "@clerk/nextjs";

export function FirebaseTokenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useOnUserStateChange();

  const auth = useAuth();
  const { user } = useUser();

  const signInWithCustomToken = useSignInWithCustomToken();
  const updateAuthEmail = useUpdateAuthEmail();
  useEffect(() => {
    const signIn = async () => {
      if (
        !auth.isLoaded ||
        !auth.isSignedIn ||
        signInWithCustomToken.isPending ||
        signInWithCustomToken.isSuccess ||
        signInWithCustomToken.isError
      ) {
        return;
      }

      try {
        const token = await auth.getToken({ template: "integration_firebase" });
        if (token) {
          signInWithCustomToken.mutate(token);
          updateAuthEmail.mutate(
            user?.emailAddresses[0].emailAddress || "test",
          );
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    signIn().then((r) => {
      console.log("signIn", r);
    });
  }, [auth, signInWithCustomToken, updateAuthEmail, user?.emailAddresses]);

  return <>{children}</>;
}
