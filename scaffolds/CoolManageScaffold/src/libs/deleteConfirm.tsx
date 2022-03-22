import { Dialog } from '@alifd/next';

const deleteConfirm: (props?: { onOk?: () => void }) => Promise<boolean> = ({ onOk } = {}) => {
  return new Promise((resolve) => {
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
      onOk: () => {
        resolve(true);
        onOk?.();
      },
      onCancel: () => {
        resolve(false);
      },
    });
  });
};

export default deleteConfirm;
