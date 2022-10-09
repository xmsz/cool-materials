import { showToast } from '@uni/toast';

export const getErrMessage = (err: any) => err.response?.data?.message || err.message || err.errMsg || err;
export default (err: any) => {
  const content = getErrMessage(err);
  showToast({ content, type: 'fail' });
  return content;
};
