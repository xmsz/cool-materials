import { useMount } from 'ahooks';
import Aside from './comps/Aside';
import Detail from './comps/Detail';
import pageStore from './store';

function List() {
  const [settingState, settingDispatchers] = pageStore.useModel('setting');
  useMount(() => {
    settingDispatchers.runList().then((res) => {
      res.list[0] && settingDispatchers.setCurrent(res.list[0].id);
    });
  });

  return (
    <div className="flex h-full">
      <Aside />
      <div className="flex-grow overflow-auto pt-11.5">{settingState.current ? <Detail /> : null}</div>
    </div>
  );
}

export default List;
