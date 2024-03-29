import handleWrapper from '@/libs/handleWrapper';
import { CronPlanService } from '@/services/cronPlan';
import { Button, Drawer, Field, Form, Input } from '@alifd/next';
import { useMemoizedFn, useMount } from 'ahooks';
import { CronPlan } from '@/interface';
import dayjs from 'dayjs';
import showErrMessage from '@/libs/showErrMessage';
import { useMemo } from 'react';

const DefaultValue: Partial<CronPlan> = {};
interface EditProps {
  defaultValue?: typeof DefaultValue;
  onMount?: (payload: { submit: () => void }) => void;
  onSuccess?: () => void;
  type: 'edit' | 'add' | 'preview';
  id?: number;
}

const Edit = ({ onMount, onSuccess, defaultValue, type = 'edit' }: EditProps) => {
  const field = Field.useField({
    values: { ...DefaultValue, name: `推送计划 ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`, ...defaultValue },
  });
  const isPreview = useMemo(() => type === 'preview', [type]);

  const submit = useMemoizedFn(async () => {
    const validateRes = await field.validatePromise();
    if (validateRes.errors) return;
    const postObj = {
      ...(validateRes.values as typeof DefaultValue),
    };

    handleWrapper(type === 'edit' ? CronPlanService.Update : CronPlanService.Create, {
      payload: {
        ...postObj,
      },
      onSuccess,
    });
  });
  useMount(() => {
    onMount?.({ submit });
  });

  return (
    <div>
      <div className="border border-gray-200 rounded-lg bg-white p-6">
        <Form field={field} isPreview={isPreview}>
          <Form.Item label="计划名称" name="name">
            <Input />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

Edit.show = async (props: EditProps) => {
  let defaultValue: EditProps['defaultValue'] | undefined;
  const { type, id } = props;
  try {
    if (type === 'edit' && id) {
      defaultValue = await CronPlanService.Detail({ id });
    }
  } catch (err) {
    showErrMessage(err);
    return;
  }

  let ref: Parameters<Required<EditProps>['onMount']>[0];
  const inst = Drawer.show({
    title: (
      <div className="flex items-center justify-between -my-2 w-full">
        {type === 'add' ? '创建' : '编辑'}推送计划
        <Button
          type="primary"
          onClick={() => {
            ref.submit();
          }}
        >
          保存
        </Button>
      </div>
    ),
    width: '100%',
    bodyStyle: {
      backgroundColor: '#f7f6fa',
    },
    content: (
      <Edit
        defaultValue={defaultValue}
        {...props}
        onMount={(payload) => {
          ref = payload;
          props.onMount?.(payload);
        }}
        onSuccess={() => {
          inst.hide();
          props.onSuccess?.();
        }}
      />
    ),
  });
};
Edit.add = (props: Omit<EditProps, 'type'>) => {
  return Edit.show({ ...props, type: 'add' });
};
Edit.edit = (props: Omit<EditProps, 'type'> & { id: number }) => {
  return Edit.show({ ...props, type: 'edit' });
};

export default Edit;
