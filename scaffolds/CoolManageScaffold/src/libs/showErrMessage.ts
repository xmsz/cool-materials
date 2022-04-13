import { Message } from '@alifd/next';

export default (err: any) => {
  Message.notice({ content: err.response?.data?.message || err.message || err.errMsg });
};
