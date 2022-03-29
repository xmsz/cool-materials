import showErrMessage from './showErrMessage';
import { Message } from '@alifd/next';

export default async <T>(
  handler: () => Promise<T>,
  { successText, onSuccess }: { successText?: string; onSuccess?: (res: T) => void } = {},
) => {
  try {
    Message.loading({ title: '处理中' });
    const res = await handler();
    Message.success({
      title: successText ?? '操作成功',
    });

    onSuccess?.(res);
  } catch (err) {
    Message.hide();
    showErrMessage(err);
  } finally {
    //
  }
};
