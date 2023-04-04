import { firestore } from 'firebase-admin';
import { MEMBER_COL, MSG_COL } from '../constant';
import FirebaseAdmin from '../firebase_admin';
import BadReqErr from '../../controllers/error/bad_request';
import { InMessage, InMessageServer } from './in_message';
import { InAuthUser } from '../in_auth_user';

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
    let messageCount = 1;
    const memberDoc = await transaction.get(memberRef);
    if (memberDoc.exists === false) {
      throw new BadReqErr('존재하지 않는 사용자입니다.');
    }
    const memberData = memberDoc.data() as InAuthUser & { messageCount?: number };
    if (memberData.messageCount !== undefined) {
      messageCount = memberData.messageCount;
    }
    const newMessageRef = memberRef.collection(MSG_COL).doc();
    const newMessageBody = {
      message,
      createAt: firestore.FieldValue.serverTimestamp(),
      messageNo: messageCount,
      author,
    };
    await transaction.set(newMessageRef, newMessageBody);
    await transaction.update(memberRef, { messageCount: messageCount + 1 });
  });
}

async function list(uid: string, page = 1, size = 10) {
  const memberRef = Firestore.collection(MEMBER_COL).doc(uid);
  const listData = await Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    if (memberDoc.exists === false) {
      throw new BadReqErr('존재하지 않는 사용자입니다.');
    }
    const memberData = memberDoc.data() as InAuthUser & { messageCount?: number };
    const { messageCount = 0 } = memberData;
    const totalElements = messageCount !== undefined ? messageCount - 1 : 0;
    const remains = totalElements % size;
    const totalPages = (totalElements - remains) / size + (remains > 0 ? 1 : 0);
    const startAt = totalElements - (page - 1) * size;
    if (startAt < 0) {
      return {
        totalElements,
        totalPages: 0,
        page,
        size,
        data: [],
      };
    }
    const messageCol = memberRef.collection(MSG_COL).orderBy('messageNo', 'desc').startAt(startAt).limit(size);
    const messageColDoc = await transaction.get(messageCol);
    const data = messageColDoc.docs.map((mv) => {
      const docData = mv.data() as Omit<InMessageServer, 'id'>;
      const returnData: InMessage = {
        ...docData,
        id: mv.id,
        createAt: docData.createAt.toDate().toISOString(),
        replyAt: docData.replyAt?.toDate().toISOString(),
      };
      return returnData;
    });
    return {
      totalElements,
      totalPages,
      data,
      page,
      size,
    };
  });
  return listData;
}

async function get({ uid, messageId }: { uid: string; messageId: string }) {
  const memberRef = Firestore.collection(MEMBER_COL).doc(uid);
  const getData = await Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    if (memberDoc.exists === false) {
      throw new BadReqErr('존재하지 않는 사용자입니다.');
    }
    const messageRef = memberRef.collection(MSG_COL).doc(messageId);
    const messageDoc = await transaction.get(messageRef);
    if (messageDoc.exists === false) {
      throw new BadReqErr('존재하지 않는 메세지입니다.');
    }
    const data = messageDoc.data() as Omit<InMessageServer, 'id'>;
    const returnData: InMessage = {
      ...data,
      id: messageDoc.id,
      createAt: data.createAt.toDate().toISOString(),
      replyAt: data.replyAt?.toDate().toISOString() ?? undefined,
    };
    return returnData;
  });
  return getData;
}

async function postReply({ uid, id, reply }: { uid: string; id: string; reply: string }) {
  const memberRef = Firestore.collection(MEMBER_COL).doc(uid);
  await Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    if (memberDoc.exists === false) {
      throw new BadReqErr('존재하지 않는 사용자입니다 : reply');
    }
    const messageRef = memberRef.collection(MSG_COL).doc(id);
    await transaction.update(messageRef, {
      reply,
      replyAt: firestore.FieldValue.serverTimestamp(),
    });
  });
}

const MessageModel = {
  post,
  list,
  postReply,
  get,
};

export default MessageModel;
