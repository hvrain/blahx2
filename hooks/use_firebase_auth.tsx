import { useState, useEffect } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { InAuthUser } from '../models/in_auth_user';
import FirebaseClient from '../models/firebase_client';

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<InAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const signInResult = await signInWithPopup(FirebaseClient.getInstance().Auth, provider);
      if (signInResult.user) {
        console.info(signInResult.user);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function signOut() {
    setIsLoading(true);
    await FirebaseClient.getInstance().Auth.signOut();
    setAuthUser(null);
    setIsLoading(false);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FirebaseClient.getInstance().Auth, (user) => {
      if (user === null) {
        setAuthUser(null);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setAuthUser({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    isLoading,
    signInWithGoogle,
    signOut,
  };
}
