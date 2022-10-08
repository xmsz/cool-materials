import showErrMessage from './showErrMessage';
import { showLoading, hideLoading } from '@uni/loading';
import { showToast } from '@uni/toast';

export default async <T, PAYLOAD>(
  handler: (payload?: PAYLOAD) => Promise<T>,
  {
    successText,
    payload,
    onSuccess,
    onFinally,
    onError,
  }: {
    successText?: string | boolean;
    payload?: PAYLOAD;
    onSuccess?: (res: T) => void;
    onFinally?: () => void;
    onError?: (err: any) => void;
  } = {},
) => {
  try {
    showLoading({ content: '处理中' });
    const res = await handler(payload);

    hideLoading();

    if (successText !== false) {
      showToast({
        type: 'success',
        content: successText ? String(successText) : '操作成功',
      });
    }

    onSuccess?.(res);
  } catch (err) {
    onError?.(err);
    hideLoading();
    showErrMessage(err);
  } finally {
    onFinally?.();
  }
};
