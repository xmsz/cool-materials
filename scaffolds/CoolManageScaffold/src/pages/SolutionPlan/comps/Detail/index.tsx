import { Message, Tab } from '@alifd/next';
import { useDebounceFn } from 'ahooks';
import Edit from '../Edit';
import { SolutionPlan } from '@/interface';
import pageStore from '../../store';

const Detail = () => {
  const [settingState, settingDispatchers] = pageStore.useModel('setting');
  const { current: id, updateMessageProps, data } = settingState;

  const { run: onChange } = useDebounceFn(
    ({ id, ...payload }: Partial<SolutionPlan>) => {
      if (id) {
        settingDispatchers.update({ id, ...payload });
      }
    },
    { wait: 500 },
  );

  return (
    <div className="bg-gray-50  h-full flex flex-col overflow-hidden">
      <header className="p-4 bg-white pb-[19px] flex items-center">
        <b className="block text-xl">{data?.name}</b>
        {updateMessageProps && <Message className="ml-1 next-small" shape="addon" {...updateMessageProps} />}
      </header>
      <Tab
        animation={false}
        navClassName="bg-white! px-4"
        contentClassName="bg-gray-50 overflow-auto h-full "
        className="flex-grow overflow-hidden "
      >
        <Tab.Item title="方案配置">
          <div className="p-4 flex justify-between">
            <div className="flex-grow">
              <Edit type="preview" id={id} defaultValue={data} onChange={onChange} />
            </div>
          </div>
        </Tab.Item>
      </Tab>
    </div>
  );
};

export default Detail;
