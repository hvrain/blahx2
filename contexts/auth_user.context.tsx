/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useMemo } from 'react';
import { InAuthUser } from '@/models/in_auth_user';
import useFirebaseAuth from '../hooks/use_firebase_auth';

interface InAuthUserContext {
  authUser: InAuthUser | null;
  isLoading: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
}

const AuthUserContext = createContext<InAuthUserContext>({
  authUser: null,
  isLoading: false,
  signInWithGoogle: async () => ({ user: null, credential: null }),
  signOut: () => { },
});

export const AuthUserProvider = function ({ children }: { children: React.ReactNode }) {
  const auth = useFirebaseAuth();
  return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>;
};

export const useAuth = () => useContext(AuthUserContext);
