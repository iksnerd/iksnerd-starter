import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  signInWithCustomToken,
  signInAnonymously,
  updatePassword,
  updateProfile,
  User,
} from '@firebase/auth';
import { AuthenticationService, AuthUser } from '@/core';
import { firebaseClient } from '@/infrastructure';

export const authenticationService: AuthenticationService = {
  onUserStateChanged(callback) {
    return onAuthStateChanged(firebaseClient.auth, async (user) => {
      if (!user) {
        callback(null);
        return;
      }

      callback(createAuthUser(user));
    });
  },

  async signInAnonymously() {
    await signInAnonymously(firebaseClient.auth);
  },

  async signInWithCustomToken(token) {
    await signInWithCustomToken(firebaseClient.auth, token);
  },

  async signInWithEmailAndPassword({ email, password }) {
    await signInWithEmailAndPassword(firebaseClient.auth, email, password);
  },

  async updatePassword(password) {
    if (!firebaseClient.auth.currentUser) {
      throw new Error('No user signed in');
    }

    await updatePassword(firebaseClient.auth.currentUser, password);
  },

  async updateEmail(email) {
    if (!firebaseClient.auth.currentUser) {
      throw new Error('No user signed in');
    }

    await updateEmail(firebaseClient.auth.currentUser, email);
  },

  async updateProfile(data) {
    if (!firebaseClient.auth.currentUser) {
      throw new Error('No user signed in');
    }

    await updateProfile(firebaseClient.auth.currentUser!, data);
  },

  async sendPasswordResetEmail(email) {
    await sendPasswordResetEmail(firebaseClient.auth, email);
  },

  async signOut() {
    await signOut(firebaseClient.auth);
  },
};

function createAuthUser(user: User | null): AuthUser | null {
  if (!user) {
    return null;
  }

  return {
    uid: user.uid,
    email: user.email || '',
    emailVerified: user.emailVerified,
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
  };
}
