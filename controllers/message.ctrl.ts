import { NextApiRequest, NextApiResponse } from 'next';
import BadReqErr from './error/bad_request';
import MessageModel from '@/models/message/message.model';

async function post(req: NextApiRequest, res: NextApiResponse) {
  const { uid, message, author } = req.body;
  if (uid === null || uid === undefined) {
    throw new BadReqErr('uid가 누락되었습니다.');
  }
  if (message === null || message === undefined) {
    throw new BadReqErr('message가 누락되었습니다.');
  }

  await MessageModel.post({ uid, message, author });
  return res.status(201).end();
}

async function list(req: NextApiRequest, res: NextApiResponse) {
  const { uid, page, size } = req.query;
  if (uid === null || uid === undefined) {
    throw new BadReqErr('screenName이 누락되었습니다.');
  }
  const convertPage = page === undefined ? '1' : page;
  const convertSize = size === undefined ? '10' : size;
  const uidToStr = Array.isArray(uid) ? uid[0] : uid;
  const pageToStr = Array.isArray(convertPage) ? convertPage[0] : convertPage;
  const sizeToStr = Array.isArray(convertSize) ? convertSize[0] : convertSize;
  const listResult = await MessageModel.list(uidToStr, parseInt(pageToStr, 10), parseInt(sizeToStr, 10));
  if (listResult === null) {
    return res.status(404).end();
  }
  res.status(200).send(listResult);
}

async function get(req: NextApiRequest, res: NextApiResponse) {
  const { uid, messageId } = req.query;
  if (uid === null || uid === undefined) {
    throw new BadReqErr('uid가 누락되었습니다.');
  }
  if (messageId === null || messageId === undefined) {
    throw new BadReqErr('messageId가 누락되었습니다.');
  }
  const uidToStr = Array.isArray(uid) ? uid[0] : uid;
  const messageIdToStr = Array.isArray(messageId) ? messageId[0] : messageId;
  const getResult = await MessageModel.get({ uid: uidToStr, messageId: messageIdToStr });
  if (getResult === null) {
    return res.status(404).end();
  }
  res.status(200).send(getResult);
}

async function postReply(req: NextApiRequest, res: NextApiResponse) {
  const { uid, id, reply } = req.body;
  if (uid === null || uid === undefined) {
    throw new BadReqErr('uid가 누락되었습니다 : reply');
  }
  if (reply === null || reply === undefined) {
    throw new BadReqErr('reply가 누락되었습니다 : reply');
  }
  await MessageModel.postReply({ uid, id, reply });
  return res.status(201).end();
}

const MessageCtrl = {
  post,
  list,
  postReply,
  get,
};

export default MessageCtrl;
