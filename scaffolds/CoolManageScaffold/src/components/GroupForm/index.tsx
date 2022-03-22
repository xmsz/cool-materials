import { IGroup, IGroupCreateReq } from '@/interface';
import handleWrapper from '@/libs/handleWrapper';
import groupService from '@/service/group';
import store from '@/store';
import { ConfigProvider, Dialog, Field, Form, Input, Select } from '@alifd/next';
import { SelectProps } from '@alifd/next/types/select';
import { useMemoizedFn } from 'ahooks';

type IValues = IGroupCreateReq;
const values: IValues = {
  name: '',
};

const GroupSelectRaw = (props: SelectProps) => {
  const [groupState] = store.useModel('group');

  return (
    <Select
      dataSource={groupState.list.map((item) => ({ label: item.name, value: item.id }))}
      defaultValue={0}
      {...props}
    />
  );
};

export const GroupSelect = ConfigProvider.config(GroupSelectRaw) as typeof GroupSelectRaw;

const FormPopupRaw = ({
  visible,
  onSuccess,
  onClose,
}: {
  visible?: boolean;
  onSuccess?: (group: IGroup) => void;
  onClose?: () => void;
}) => {
  const field = Field.useField({ values });
  const [, groupDispatchers] = store.useModel('group');

  const handleSubmit = useMemoizedFn(async () => {
    const { errors, values } = await field.validatePromise();
    if (errors) return;

    handleWrapper(async () => {
      const res = await groupService.Create(values as IValues);
      await groupDispatchers.Refresh();
      onSuccess?.(res);
      onClose?.();
    });
  });

  return (
    <Dialog title="新建分组" closeMode={[]} width={520} visible={visible} onOk={handleSubmit} onClose={onClose}>
      <Form field={field}>
        <Form.Item label="分组名称" name="name" required>
          <Input />
        </Form.Item>
      </Form>
    </Dialog>
  );
};

export const GroupFormPopup = ConfigProvider.config(FormPopupRaw) as typeof FormPopupRaw;
