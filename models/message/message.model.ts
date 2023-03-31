import { firestore } from 'firebase-admin';
import { MEMBER_COL, MSG_COL } from '../constant';
import FirebaseAdmin from '../firebase_admin';
import BadReqErr from '../../controllers/error/bad_request';

const Firestore = FirebaseAdmin.getInstance().firestore;

async function post({
  uid,
  author,
  message,
}: {
  uid: string;
  message: string;
  author?: {
    displayName: string | null;
    photoURL: string | null;
  };
}) {
  const memberRef = Firestore.collection(MEMBER_COL).doc(uid);
  await Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    if (memberDoc.exists === false) {
      throw new BadReqErr('존재하지 않는 사용자입니다.');
    }
    const newMessageRef = memberRef.collection(MSG_COL).doc();
    const newMessageBody = {
      message,
      createAt: firestore.FieldValue.serverTimestamp(),
      author,
    };
    await transaction.set(newMessageRef, newMessageBody);
  });
}

const MessageModel = {
  post,
};

export default MessageModel;
