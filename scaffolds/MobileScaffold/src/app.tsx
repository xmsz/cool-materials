// MPA 模式下该文件无效
import { runApp, IAppConfig } from 'rax-app';
import dayjs from 'dayjs';
import Auth from './components/Auth';
import { createElement, PropsWithChildren, useState } from 'rax';
import store from './store';
import { UserService } from './services/user';
import { useMount } from 'ahooks';
import showErrMessage from './libs/showErrMessage';

require('dayjs/locale/zh-cn');

dayjs.locale('zh-cn');

const StoreInitialStates = ({ children }: PropsWithChildren<{}>) => {
  const userDispatchers = store.useModelDispatchers('user');

  const [hasInit, setHasInit] = useState(false);
  useMount(async () => {
    try {
      const user = await UserService.Info({});
      userDispatchers.setState(user);
    } catch (err) {
      showErrMessage(err);
    } finally {
      setHasInit(true);
    }
  });

  return <>{hasInit ? children : null}</>;
};

const appConfig: IAppConfig = {
  router: {
    type: 'browser',
  },
  app: {
    addProvider: ({ children }) => {
      return (
        <Auth>
          <StoreInitialStates>{children}</StoreInitialStates>
        </Auth>
      );
    },
  },
};
runApp(appConfig);
