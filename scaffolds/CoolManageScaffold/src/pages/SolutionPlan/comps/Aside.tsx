import IconButton from '@/components/IconButton';
import handleWrapper from '@/libs/handleWrapper';
import { SolutionPlanService } from '@/services/solutionPlan';
import { Dialog, Switch, Balloon, Button, Menu } from '@alifd/next';
import { useMemoizedFn } from 'ahooks';
import { SolutionPlan } from '@/interface';
import pageStore from '../store';
import Edit from './Edit';

type IRecord = SolutionPlan;

const Article = ({ item }: { item: IRecord }) => {
  const [settingState, settingDispatcher] = pageStore.useModel('setting');

  const handleDelete = useMemoizedFn((record: IRecord) => {
    const onOk = () => {
      handleWrapper(SolutionPlanService.Delete, {
        payload: {
          id: record.id,
        },
        onSuccess: () => {
          settingDispatcher.refreshList().then((res) => {
            res.list[0] && settingDispatcher.setCurrent(res.list[0].id);
          });
        },
      });
    };
    Dialog.confirm({
      title: '确认删除计划？',
      okProps: {
        children: '确认',
        warning: true,
      },
      onOk,
      closeMode: [],
    });
  });

  const switchEnable = useMemoizedFn((e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
    handleWrapper(() =>
      settingDispatcher.update({
        ...item,
        enable: item.enable ? 0 : 1,
        updateMessage: false,
      }),
    );
  });

  return (
    <li
      key={item.id}
      className={`px-4 py-4 border-b border-gray-200 border-opacity-70 cursor-pointer ${
        settingState.current === item.id ? ' bg-gray-50 ' : ''
      } hover:bg-gray-50`}
      onClick={() => {
        settingDispatcher.setCurrent(item.id);
      }}
    >
      <header className="flex items-center justify-between">
        <span
          className={`flex-grow text-sm ${
            settingState.current === item.id ? ' text-gray-800 font-bold' : 'text-gray-700'
          }`}
        >
          {item.name}
        </span>
        <Switch
          size="small"
          onClick={(e) => {
            switchEnable(e);
          }}
          checked={!!item.enable}
        />
        <Balloon.Tooltip
          align="r"
          trigger={
            <Button text type="secondary" className="ml-2">
              <i className="ic-round md-more_vert " />
            </Button>
          }
        >
          <Menu embeddable className="-my-2 -mx-3">
            <Menu.Item
              className=" text-red-600!"
              onClick={() => {
                handleDelete(item);
              }}
            >
              删除
            </Menu.Item>
          </Menu>
        </Balloon.Tooltip>
      </header>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-gray text-xs scale-90 origin-left">所有企微号</span>
      </div>
    </li>
  );
};
const Aside = () => {
  const [settingState, settingDispatcher] = pageStore.useModel('setting');

  return (
    <div className={` border-gray-200 border-opacity-70 border-r flex-shrink-0 w-80 pt-11.5`}>
      <header className="px-4 py-3 flex items-center justify-between">
        <b className="text-xl text-gray-900 ">添加申请</b>
        <IconButton icon="list_alt" text type="secondary">
          <span className="font-normal">申请记录</span>
        </IconButton>
      </header>
      <div className="px-4 flex items-center justify-end">
        <IconButton
          type="primary"
          icon="add"
          iconType="bg"
          // size="small"
          className="w-full"
          onClick={() => {
            Edit.add({
              onSuccess: () => {
                settingDispatcher.refreshList().then((res) => settingDispatcher.setCurrent(res.list[0]?.id || 0));
              },
            });
          }}
        >
          创建方案
        </IconButton>
      </div>

      <section className=" mt-4 border-t border-gray-200  ">
        {/* <header className="px-4 text-gray-400 text-xs scale-90 origin-left">方案列表</header> */}
        <ul className="">
          {settingState.list.map((item) => (
            <Article key={item.id} item={item} />
          ))}
        </ul>
      </section>

      {/* <section className="mt-6 border-t border-gray-200">
          <BasicAside.Menu list={[{ label: '申请记录', value: '2' }]} activeKey={location.pathname} />
        </section> */}
    </div>
  );
};

export default Aside;
