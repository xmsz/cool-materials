import handleWrapper from '@/libs/handleWrapper';
import {
  Button,
  Checkbox,
  Drawer,
  Field,
  Form,
  Input,
  NumberPicker,
  Radio,
  Switch,
  TimePicker2,
  Transfer,
  Typography,
} from '@alifd/next';
import { useMemoizedFn, useMount, useRequest } from 'ahooks';
import { SolutionPlan } from '@/interface';
import dayjs from 'dayjs';
import showErrMessage from '@/libs/showErrMessage';
import { PropsWithChildren, useEffect, useState } from 'react';
import { SolutionPlanService } from '@/services/solutionPlan';
import TagInput from '@/components/TagInput';
import { QWClientService } from '@/services/QWClient';

const Section = ({ title, children }: PropsWithChildren<{ title?: string }>) => {
  return (
    <section
      className=" mb-5 py-4 px-6 border-gray-200 border  border-opacity-70 rounded-md bg-white "
      style={{
        background: 'linear-gradient(0deg, #fff 80%, #fbfbfc)',
      }}
    >
      <Typography.H6 className="text-gray-400">{title}</Typography.H6>
      <div className="pt-2">{children}</div>
    </section>
  );
};

type IState = Partial<SolutionPlan>;
const DefaultValue: IState = {
  // nicknameIncludeKeywords: [],
  // nicknameIncludeKeywordsInput: '',
  // sleepEnable: true,
  // enable: true,
  // dayAddLimitMode: 'unlimited',
};
interface EditProps {
  defaultValue?: typeof DefaultValue;
  onMount?: (payload: { submit: () => void }) => void;
  onSuccess?: () => void;
  type: 'edit' | 'add' | 'preview';
  id?: number;
  onChange?: (payload: IState) => void;
}
const FormItemLayout = {
  labelCol: { span: 4 },
  labelTextAlign: 'left',
} as const;

const Edit = ({ onMount, onSuccess, defaultValue, type = 'edit', onChange }: EditProps) => {
  const [state, setState] = useState<IState>({});
  const field = Field.useField({
    onChange: () => {
      const newValues = field.getValues() as IState;
      setState(newValues);
      onChange?.(field.getValues());
    },
  });
  const init = useMemoizedFn(() => {
    const newValues = {
      ...DefaultValue,
      name: `方案 ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
      ...defaultValue,
    };
    setState(newValues);
    field.setValues(newValues);
  });
  // const isPreview = useMemo(() => type === 'preview', [type]);

  const submit = useMemoizedFn(async () => {
    const validateRes = await field.validatePromise();
    if (validateRes.errors) return;
    const postObj = {
      ...(validateRes.values as typeof DefaultValue),
    };

    handleWrapper(type === 'edit' ? SolutionPlanService.Update : SolutionPlanService.Create, {
      payload: {
        ...postObj,
      },
      onSuccess,
    });
  });
  useMount(() => {
    onMount?.({ submit });
  });

  const { data: qwClient } = useRequest(QWClientService.List);

  useEffect(() => {
    init();
  }, [defaultValue]);

  return (
    <Form field={field} {...FormItemLayout}>
      <div className="bg-white rounded-lg px-6 pt-4  border border-gray-200 mb-3">
        <Form.Item label="方案名称" name="name" {...FormItemLayout}>
          <Input className="w-88!" />
        </Form.Item>
        <Form.Item label="应用企微号" {...FormItemLayout}>
          <Transfer
            dataSource={qwClient?.list.map((item) => ({
              label: item.qwUser?.name,
              value: item.id,
            }))}
          />
        </Form.Item>
      </div>

      <div className="bg-white rounded-lg px-6 pt-4 border border-gray-200">
        <Form.Item label="开启自动通过" name="enable" {...FormItemLayout}>
          <Switch className="mt-1.5" checked={!!state.enable} />
        </Form.Item>
        <div className=" relative ">
          {state.enable ? (
            <>
              <Section title="基础设置">
                <Form.Item label="休眠时间段" {...FormItemLayout} name="sleepEnable">
                  <Switch className="mt-1.5" />
                </Form.Item>
                {state.sleepEnable && (
                  <Form.Item className="-mt-2 mb-6" label=" " {...FormItemLayout}>
                    <TimePicker2.RangePicker format="HH:mm" className="bg-white" />
                  </Form.Item>
                )}

                <Form.Item label="每日添加上限" {...FormItemLayout} name="dayAddLimitMode">
                  <Radio.Group
                    shape="button"
                    dataSource={[
                      { label: '不限', value: 'unlimited' },
                      { label: '自定义', value: 'custom' },
                    ]}
                  />
                </Form.Item>
                {state.dayAddLimitMode === 'custom' && (
                  <Form.Item className="-mt-2 mb-6" label=" " {...FormItemLayout} name="dayAddLimitNum">
                    <NumberPicker innerAfter="人" className="w-24!" min={0} defaultValue={1} />
                  </Form.Item>
                )}

                <Form.Item label="通过间隔" {...FormItemLayout}>
                  <div className="flex items-center ">
                    <Form.Item className="mb-0">
                      <NumberPicker innerAfter="秒" defaultValue={30} />
                    </Form.Item>
                    <span className="mx-3">至</span>
                    <Form.Item className="mb-0">
                      <NumberPicker innerAfter="秒" defaultValue={60} />
                    </Form.Item>
                  </div>
                </Form.Item>
              </Section>

              <Section title="通过条件">
                <Form.Item label="添加来源" {...FormItemLayout}>
                  <Checkbox.Group
                    dataSource={[
                      {
                        label: '扫一扫',
                        value: 'scan',
                      },
                      {
                        label: '名片',
                        value: 'card',
                      },
                      {
                        label: '手机号',
                        value: 'phone',
                      },
                      {
                        label: '群聊',
                        value: 'room',
                      },
                    ]}
                  />
                </Form.Item>

                <Form.Item label="昵称包含关键词" name="nicknameIncludeKeywordsInput" {...FormItemLayout}>
                  <TagInput />
                </Form.Item>
              </Section>

              <Section title="拒绝条件">
                <Form.Item label="昵称包含关键词" {...FormItemLayout}>
                  <TagInput />
                </Form.Item>

                <Form.Item label="企业名称包含关键词" name="nicknameIncludeKeywordsInput" {...FormItemLayout}>
                  <TagInput />
                </Form.Item>
              </Section>
            </>
          ) : null}
        </div>
      </div>
    </Form>
  );
};

Edit.show = async (props: EditProps) => {
  let defaultValue: EditProps['defaultValue'] | undefined;
  const { type, id } = props;
  try {
    if (type === 'edit' && id) {
      defaultValue = await SolutionPlanService.Detail({ id });
    }
  } catch (err) {
    showErrMessage(err);
    return;
  }

  let ref: Parameters<Required<EditProps>['onMount']>[0];
  const inst = Drawer.show({
    title: (
      <div className="flex items-center justify-between -my-2 w-full">
        {type === 'add' ? '创建' : '编辑'}方案
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
