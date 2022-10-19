import { Message } from '@alifd/next';

export const getErrMessage = (err) => {
  return err.response?.data?.message || err.message || err.errMsg || err;
};
export default (err: any) => {
  const errMsg = getErrMessage(err);
  Message.notice({ content: errMsg });
  return errMsg;
};
