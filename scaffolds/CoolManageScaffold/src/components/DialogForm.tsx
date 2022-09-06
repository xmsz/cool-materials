import { Dialog, Form } from '@alifd/next';
import { QuickShowConfig } from '@alifd/next/types/dialog';

const DialogForm = () => {};

DialogForm.show = ({
  onSubmit,
  defaultValue,
  ...props
}: Omit<QuickShowConfig, 'onSubmit' | 'defaultValue'> & {
  onSubmit?: (value: any) => void;
  defaultValue?: any;
}) => {
  const inst = Dialog.show({
    closeMode: [],
    v2: true,
    dialogRender: (model) => (
      <Form className="mx-auto" value={defaultValue}>
        {model}
      </Form>
    ),
    okProps: {
      children: (
        <Form.Submit
          className="-mx-3"
          type="primary"
          validate
          component="a"
          onClick={(value, error) => {
            console.log(value, error);
            if (error) return;
            onSubmit?.(value);
          }}
        >
          提交
        </Form.Submit>
      ),
    },
    onOk: () => {
      return false;
    },
    ...props,
  });

  return inst;
};

export default DialogForm;
