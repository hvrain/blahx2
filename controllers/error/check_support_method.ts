import BadReqErr from './bad_request';

export default function checkSupportMethod(supportMethods: string[], method) {
  if (supportMethods.includes(method) === false) {
    throw new BadReqErr('지원하지 않는 method입니다.');
  }
}
