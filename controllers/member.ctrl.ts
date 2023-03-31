// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import MemeberModel from '@/models/member.model';
import BadReqErr from '@/controllers/error/bad_request';

async function add(req: NextApiRequest, res: NextApiResponse) {
  const { uid, displayName, email, photoURL } = req.body;
  if (uid === null || uid === undefined) {
    throw new BadReqErr('uid가 누락되었습니다.');
  }
  if (email === null || email === undefined) {
    throw new BadReqErr('email이 누락되었습니다.');
  }

  const addResult = await MemeberModel.add({ uid, email, displayName: displayName ?? '', photoURL: photoURL ?? '' });

  return res.status(200).send(addResult);
}

async function findByScreenName(req: NextApiRequest, res: NextApiResponse) {
  const { screenName } = req.query;
  if (screenName === null || screenName === undefined) {
    throw new BadReqErr('screenName이 누락되었습니다.');
  }
  const screenNameStr = Array.isArray(screenName) ? screenName[0] : screenName;
  const findResult = await MemeberModel.findByScreenName(screenNameStr);
  if (findResult === null) {
    return res.status(404).end();
  }
  res.status(200).send(findResult);
}

const MemberCtrl = {
  add,
  findByScreenName,
};

export default MemberCtrl;
