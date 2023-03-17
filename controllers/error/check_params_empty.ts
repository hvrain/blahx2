import BadReqErr from './bad_request';

export default function checkMissingParams(paramObj: object) {
  Object.entries(paramObj).forEach(([key, value]) => {
    if (value === undefined || value === null || Object.keys(value).length === 0) {
      throw new BadReqErr(`${key}가 누락되었습니다.`);
    }
  });
}
