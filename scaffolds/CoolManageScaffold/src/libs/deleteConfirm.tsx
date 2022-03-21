import { Dialog } from '@alifd/next';

export default ({ onOk }: { onOk: () => void }) => {
  Dialog.confirm({
    title: '是否删除',
    content: '请确认是否删除?',
    closeMode: [],
    messageProps: {
      type: 'warning',
    },
    okProps: {
      warning: true,
    },
    onOk,
  });
};
