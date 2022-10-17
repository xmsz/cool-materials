import { Message } from '@alifd/next';

export default (err: any) => {
  const errMsg = err.response?.data?.message || err.message || err.errMsg || err;
  Message.notice({ content: errMsg });
  return errMsg;
};
