import { firestore } from 'firebase-admin';

export type InMessage = {
  id: string;
  message: string;
  author?: {
    displayName: string | null;
    photoURL: string | null;
  };
  createAt: string;
  reply?: string;
  replyAt?: string;
};
