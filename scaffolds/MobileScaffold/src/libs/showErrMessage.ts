import { Message } from '@alifd/meet';

export default (err: any) => {
  Message.notice({ content: err.response?.data?.message || err.message || err.errMsg || err });
};
