import { firestore } from 'firebase-admin';

export type MessageBase = {
  id: string;
  message: string;
  messageNo: number;
  author?: {
    displayName: string | null;
    photoURL: string | null;
  };
  reply?: string;
};

export type InMessage = MessageBase & {
  createAt: string;
  replyAt?: string;
};

export type InMessageServer = MessageBase & {
  createAt: firestore.Timestamp;
  replyAt?: firestore.Timestamp;
};
