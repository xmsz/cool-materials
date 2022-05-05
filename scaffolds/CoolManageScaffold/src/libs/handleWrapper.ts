import showErrMessage from './showErrMessage';
import { Message } from '@alifd/next';

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
    Message.loading({ title: '处理中' });
    const res = await handler(payload);

    Message.hide();

    if (successText !== false) {
      Message.success({
        title: successText ?? '操作成功',
      });
    }

    onSuccess?.(res);
  } catch (err) {
    onError?.(err);
    Message.hide();
    showErrMessage(err);
  } finally {
    onFinally?.();
  }
};
