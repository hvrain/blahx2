// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import MemeberModel from '@/models/member.model';
import checkMissingParams from './error/check_params_empty';

async function add(req: NextApiRequest, res: NextApiResponse) {
  const { uid, displayName, email, photoURL } = req.body;

  checkMissingParams({ uid, email });
  const addResult = await MemeberModel.add({ uid, email, displayName: displayName ?? '', photoURL: photoURL ?? '' });

  return res.status(200).send(addResult);
}

async function findByScreenName(req: NextApiRequest, res: NextApiResponse) {
  const { screenName } = req.query;
  checkMissingParams({ screenName });
  const screenNameStr = Array.isArray(screenName) ? screenName[0] : screenName;
  const findResult = await MemeberModel.findByScreenName(screenNameStr!);
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
