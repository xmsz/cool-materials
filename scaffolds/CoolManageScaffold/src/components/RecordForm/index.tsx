import { IRecordCreateReq, IRecordUpdateReq } from '@/interface';
import compShowApi from '@/libs/compShowApi';
import handleWrapper from '@/libs/handleWrapper';
import recordService from '@/service/record';
import { Button, ConfigProvider, Drawer, Field, Form, Input } from '@alifd/next';
import { useMemoizedFn } from 'ahooks';
import { GroupFormPopup, GroupSelect } from '../GroupForm';

const FormContent = ({ field }: { field: Field }) => {
  return (
    <Form field={field} responsive labelAlign="top">
      <Form.Item name="link" label="源链地址" required colSpan={12}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="key" label="短链路径" colSpan={12}>
        <Input />
      </Form.Item>
      <Form.Item name="remark" label="名称" colSpan={6}>
        <Input />
      </Form.Item>
      <Form.Item name="groupId" labelWidth={'100%'} label="分组" colSpan={6} fullWidth>
        <GroupSelect
          menuProps={{
            footer: (
              <div className="p-2 px-3 border-t border-gray-200">
                <Button
                  className="font-normal"
                  text
                  type="primary"
                  onClick={() => {
                    compShowApi(GroupFormPopup, {
                      onSuccess: (res) => {
                        field.setValue('groupId', res.id);
                      },
                    });
                  }}
                >
                  <i className="mr-1 inline-block i-ic-sharp-add" />
                  创建分组
                </Button>
              </div>
            ),
          }}
        />
      </Form.Item>
    </Form>
  );
};

const UpdatePopupRaw = ({
  visible,
  values,
  onSuccess,
  onClose,
}: {
  visible?: boolean;
  values: IRecordUpdateReq;
  onSuccess?: () => void;
  onClose?: () => void;
}) => {
  const field = Field.useField({
    values,
  });

  const handleSubmit = useMemoizedFn(async () => {
    const { errors, values: valuesOri } = await field.validatePromise();
    if (errors) return;

    const values = valuesOri as IRecordUpdateReq;
    handleWrapper(async () => {
      await recordService.Update(values);
      onSuccess?.();
      onClose?.();
    });
  });

  return (
    <Drawer
      style={{
        maxWidth: '100%',
      }}
      title={
        <div className="flex justify-between items-center">
          编辑短链
          <div className="flex-grow flex justify-end gap-2">
            {/* <Button onClick={handleSubmit} warning>
              删除
            </Button> */}
            <Button type="primary" onClick={handleSubmit}>
              保存
            </Button>
          </div>
        </div>
      }
      width={640}
      visible={visible}
      onClose={onClose}
    >
      <FormContent field={field} />
    </Drawer>
  );
};

const CreatePopupRaw = ({
  visible,
  defaultValues = {
    link: '',
  },
  onSuccess,
  onClose,
}: {
  visible?: boolean;
  defaultValues?: IRecordCreateReq;
  onSuccess?: () => void;
  onClose?: () => void;
}) => {
  const field = Field.useField({
    values: defaultValues,
  });

  const handleSubmit = useMemoizedFn(async () => {
    const { errors, values: valuesOri } = await field.validatePromise();
    if (errors) return;

    const values = valuesOri as IRecordCreateReq;

    handleWrapper(async () => {
      await recordService.Create(values);
      onSuccess?.();
      onClose?.();
    });
  });

  return (
    <Drawer
      style={{
        maxWidth: '100%',
      }}
      title={
        <div className="flex justify-between items-center">
          新建短链
          <Button type="primary" onClick={handleSubmit}>
            保存
          </Button>
        </div>
      }
      width={640}
      visible={visible}
      onClose={onClose}
    >
      <FormContent field={field} />
    </Drawer>
  );
};

export const RecordCreatePopup = ConfigProvider.config(CreatePopupRaw) as typeof CreatePopupRaw;
export const RecordUpdatePopup = ConfigProvider.config(UpdatePopupRaw) as typeof UpdatePopupRaw;
