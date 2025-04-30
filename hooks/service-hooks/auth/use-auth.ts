"use client";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";

import { AuthUser } from "@/core";
import { serviceHost } from "@/services";

enum QueryKeys {
  signInAnonymously = "signInAnonymously",
  signInWithCustomToken = "signInWithCustomToken",
  signInWithEmailAndPassword = "signInWithEmailAndPassword",
  updatePassword = "updatePassword",
  updateEmail = "updateEmail",
  updateProfile = "updateProfile",
  sendPasswordResetEmail = "sendPasswordResetEmail",
  signOut = "signOut",
}

export interface AuthStore {
  authUser: AuthUser | null;
  setAuthUser: (authUser: AuthUser | null) => void;
}

const authenticationService = serviceHost.getAuthenticationService();

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  setAuthUser: (authUser) => set({ authUser }),
}));

export const useAuthUser = () => {
  return useAuthStore((state) => state.authUser);
};

// export const useSignInAnonymously = () => {
//   return useMutation(
//     [QueryKeys.signInAnonymously],
//     authenticationService.signInAnonymously,
//   );
// };

export const useOnUserStateChange = () => {
  const setAuthUser = useAuthStore((state) => state.setAuthUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    return authenticationService.onUserStateChanged((user) => {
      console.log("user", user);
      setAuthUser(user);
      setIsLoading(false);
    });
  }, [setAuthUser]);

  return isLoading;
};

export const useSignInWithCustomToken = () => {
  return useMutation({
    mutationFn: authenticationService.signInWithCustomToken,
    mutationKey: ["signInWithCustomToken", "token"],
  });
};
//
// export const useSignInWithEmailAndPassword = () => {
//   return useMutation(
//       ["signInWithEmailAndPassword", "credentials"],
//       authenticationService.signInWithEmailAndPassword,
//   );
// };

// export const useSignUpWithEmailAndPassword = () => {
//   return useMutation(
//     ["createUserWithEmailAndPassword", "credentials"],
//     authenticationService.signUpWithEmailAndPassword,
//   );
// };

// export const useUpdatePassword = () => {
//   return useMutation(
//     [QueryKeys.updatePassword],
//     authenticationService.updatePassword,
//   );
// };
//
export const useUpdateAuthEmail = () => {
  return useMutation({
    mutationFn: authenticationService.updateEmail,
    mutationKey: [QueryKeys.updateEmail],
  });
};
//
// export const useUpdateProfile = () => {
//   return useMutation(
//     [QueryKeys.updateProfile],
//     authenticationService.updateProfile,
//   );
// };

// export const useSendPasswordResetEmail = () => {
//   return useMutation(
//       ['resetPassword', 'email'],
//       authenticationService.sendPasswordResetEmail,
//   );
// };
//
export const useSignOut = () => {
  return useMutation({
    mutationFn: authenticationService.signOut,
    mutationKey: ["signOut"],
  });
};
