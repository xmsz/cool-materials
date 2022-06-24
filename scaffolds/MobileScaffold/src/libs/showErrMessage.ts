import { showToast } from '@uni/toast';

export default (err: any) => {
  const content = err.response?.data?.message || err.message || err.errMsg || err;
  showToast({ content, type: 'fail' });
  return content;
};
