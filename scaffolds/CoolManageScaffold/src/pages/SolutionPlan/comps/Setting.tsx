import TagList from '@/components/TagList';
import {
  Field,
  Form,
  Switch,
  Typography,
  TimePicker2,
  Radio,
  Checkbox,
  Input,
  Button,
  NumberPicker,
} from '@alifd/next';
import { useMemoizedFn } from 'ahooks';
import { PropsWithChildren, useState } from 'react';

interface IValues {
  nicknameIncludeKeywords: string[];
  nicknameIncludeKeywordsInput: string;
  sleepEnable: boolean;
  enable: boolean;
  dayAddLimitMode: string;
}
const FormItemLayout = {
  labelCol: { span: 4 },
  labelTextAlign: 'left',
} as const;

const Section = ({ title, children }: PropsWithChildren<{ title?: string }>) => {
  return (
    <section
      className=" mb-5 py-4 px-6  border border-gray-200  rounded-md bg-white "
      style={{
        background: 'linear-gradient(0deg, transparent 70%, #fbfbfc)',
      }}
    >
      <Typography.H6 className="text-gray-400">{title}</Typography.H6>
      <div className="pt-2">{children}</div>
    </section>
  );
};

const Setting = () => {
  const [state, setState] = useState<IValues>({
    nicknameIncludeKeywords: [],
    nicknameIncludeKeywordsInput: '',
    sleepEnable: true,
    enable: true,
    dayAddLimitMode: 'unlimited',
  });
  const field = Field.useField({
    onChange: (name, value) => {
      setState((prev) => ({ ...prev, [name]: value }));
    },
    values: state,
  });

  const addNicknameIncludeKeywords = useMemoizedFn(() => {
    const newValues = {
      nicknameIncludeKeywords: [
        ...state.nicknameIncludeKeywords.filter((item) => item !== state.nicknameIncludeKeywordsInput),
        state.nicknameIncludeKeywordsInput,
      ],
      nicknameIncludeKeywordsInput: '',
    };
    field.setValues(newValues);
    setState((prev) => ({ ...prev, ...newValues }));
  });

  return (
    <Form field={field} {...FormItemLayout}>
      <Form.Item label="开启自动通过" className="mt-4" name="enable">
        <Switch className="mt-1.5" />
      </Form.Item>
      <div className=" relative ">
        {!state.enable && (
          <div className=" absolute w-full h-full left-0 top-0 bg-white bg-opacity-90 z-20 backdrop-blur-sm" />
        )}
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
            <Input
              className="w-90!"
              addonAfter={
                <Button
                  type={state.nicknameIncludeKeywordsInput ? 'primary' : 'normal'}
                  onClick={addNicknameIncludeKeywords}
                >
                  添加
                </Button>
              }
              onPressEnter={addNicknameIncludeKeywords}
            />
          </Form.Item>
          <Form.Item name="nicknameIncludeKeywords" className="-mt-1 mb-0" {...FormItemLayout} label=" ">
            <TagList />
          </Form.Item>
        </Section>

        <Section title="拒绝条件">
          <Form.Item label="昵称包含关键词" {...FormItemLayout}>
            <Form.Item name="nicknameIncludeKeywordsInput">
              <Input
                className="w-90!"
                addonAfter={
                  <Button
                    type={state.nicknameIncludeKeywordsInput ? 'primary' : 'normal'}
                    onClick={addNicknameIncludeKeywords}
                  >
                    添加
                  </Button>
                }
                onPressEnter={addNicknameIncludeKeywords}
              />
            </Form.Item>
            <Form.Item name="nicknameIncludeKeywords" className="-mt-1" {...FormItemLayout}>
              <TagList />
            </Form.Item>
          </Form.Item>

          <Form.Item label="企业名称包含关键词" name="nicknameIncludeKeywordsInput" {...FormItemLayout}>
            <Input
              className="w-90!"
              addonAfter={
                <Button
                  type={state.nicknameIncludeKeywordsInput ? 'primary' : 'normal'}
                  onClick={addNicknameIncludeKeywords}
                >
                  添加
                </Button>
              }
              onPressEnter={addNicknameIncludeKeywords}
            />
          </Form.Item>
          <Form.Item name="nicknameIncludeKeywords" className="-mt-1 mb-0" {...FormItemLayout} label=" ">
            <TagList />
          </Form.Item>
        </Section>
      </div>
    </Form>
  );
};

export default Setting;
