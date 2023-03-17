import { NextApiResponse } from 'next';
import CustomServerError from './custom_server_error';

export default function handleError(err: unknown, res: NextApiResponse) {
  let unknownErr = err;
  if (err instanceof CustomServerError === false) {
    unknownErr = new CustomServerError({ statusCode: 499, message: 'unknown error' });
  }
  const customError = unknownErr as CustomServerError;
  res
    .status(customError.statusCode)
    .setHeader('location', customError.location || '')
    .send(customError.serializeErrors());
}
