import showErrMessage from './showErrMessage';
import { Message } from '@alifd/next';

export default async (
  handler: () => void,
  { successText, onSuccess }: { successText?: string; onSuccess?: () => void } = {},
) => {
  try {
    Message.loading({ title: '处理中' });
    await handler();

    Message.success({
      title: successText ?? '操作成功',
    });

    onSuccess?.();
  } catch (err) {
    Message.hide();
    showErrMessage(err);
  } finally {
    //
  }
};
