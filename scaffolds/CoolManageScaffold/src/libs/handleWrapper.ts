import showErrMessage from './showErrMessage';
import { Message } from '@alifd/next';

export default async <T, PAYLOAD>(
  handler: (payload?: PAYLOAD) => Promise<T>,
  {
    successText,
    payload,
    onSuccess,
    onFinally,
  }: { successText?: string; payload?: PAYLOAD; onSuccess?: (res: T) => void; onFinally?: () => void } = {},
) => {
  try {
    Message.loading({ title: '处理中' });
    const res = await handler(payload);
    Message.hide();
    Message.success({
      title: successText ?? '操作成功',
    });

    onSuccess?.(res);
  } catch (err) {
    Message.hide();
    showErrMessage(err);
  } finally {
    onFinally?.();
  }
};
