import { NextApiRequest, NextApiResponse } from 'next';
import BadReqErr from './error/bad_request';
import MessageModel from '../models/message/message.model';

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

const MessageCtrl = {
  post,
};

export default MessageCtrl;
