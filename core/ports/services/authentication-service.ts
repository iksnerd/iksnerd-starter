import { z } from 'zod';

export const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export type Credentials = z.infer<typeof credentialsSchema>;

export type AuthUser = AuthProfile & {
  uid: string;
  email: string;
  emailVerified: boolean;
};

export const credentialsSignUpSchema = credentialsSchema.extend({
  confirmPassword: z.string().min(6).max(100),
});

export type CredentialsSignUp = z.infer<typeof credentialsSignUpSchema>;

export const credentialsResetPasswordSchema = z.object({
  email: z.string().email(),
});

export type CredentialsResetPassword = z.infer<
  typeof credentialsResetPasswordSchema
>;

// Agent
export const completeProfileSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  confirmPassword: z.string().min(6).max(100),
});

export type CompleteProfile = z.infer<typeof completeProfileSchema>;

export const authProfileSchema = z.object({
  displayName: z.string().min(2).max(100),
  photoURL: z.string().url().optional(),
});

export type AuthProfile = z.infer<typeof authProfileSchema>;

export interface AuthenticationService {
  signInAnonymously(): Promise<void>;
  onUserStateChanged(callback: (user: AuthUser | null) => void): () => void;
  signInWithCustomToken(token: string): Promise<void>;
  signInWithEmailAndPassword(credentials: Credentials): Promise<void>;
  updatePassword(password: string): Promise<void>;
  updateEmail(email: string): Promise<void>;
  updateProfile(data: AuthProfile): Promise<void>;
  sendPasswordResetEmail(email: string): Promise<void>;
  signOut(): Promise<void>;
}
