import { InAuthUser } from '@/models/in_auth_user';
import FirebaseAdmin from './firebase_admin';

const MEMBER_COL = 'members';
const SCR_NAME_COL = 'screen_names';

async function add({ uid, email, displayName, photoURL }: InAuthUser): Promise<{
  result: boolean;
  uid: string;
}> {
  const screenName = (email as string).replace('@gmail.com', '');
  await FirebaseAdmin.getInstance().firestore.runTransaction(async (transaction) => {
    const memberRef = FirebaseAdmin.getInstance().firestore.collection(MEMBER_COL).doc(uid);
    const memberDoc = await memberRef.get();
    if (memberDoc.exists === false) {
      const screenNameRef = FirebaseAdmin.getInstance().firestore.collection(SCR_NAME_COL).doc(screenName);
      const addData = {
        uid,
        email,
        displayName: displayName ?? '',
        photoURL: photoURL ?? '',
      };
      await transaction.set(memberRef, addData);
      await transaction.set(screenNameRef, addData);
    }
  });
  return { result: true, uid };
}

async function findByScreenName(screenName: string): Promise<InAuthUser | null> {
  const screenNameRef = FirebaseAdmin.getInstance().firestore.collection(SCR_NAME_COL).doc(screenName);
  const screenNameDoc = await screenNameRef.get();
  if (screenNameDoc.exists === false) {
    return null;
  }
  const data = screenNameDoc.data() as InAuthUser;
  return data;
}

const MemeberModel = {
  add,
  findByScreenName,
};

export default MemeberModel;
