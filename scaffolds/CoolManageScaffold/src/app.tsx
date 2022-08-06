import { runApp, IAppConfig } from 'ice';
import 'uno.css';
import auth from './libs/auth';
import { IRootState } from './store';
import { ConfigProvideConfig } from './config';
import { ConfigProvider } from '@alifd/next';

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
    addProvider: ({ children }) => {
      return (
        <ConfigProvider
          // @ts-ignore type
          defaultPropsConfig={ConfigProvideConfig}
        >
          {children}
        </ConfigProvider>
      );
    },
    getInitialData: async (ctx) => {
      const initialStates: Partial<IRootState> = {};
      // try {
      //   const official = await officialService.Find();
      //   initialStates.official = official;
      // } catch (err) {
      //   console.error(err);
      // }

      return {
        initialStates,
      };
    },
  },
  request: {
    interceptors: {
      request: {
        onConfig: (config) => {
          const nextConfig = { ...config };
          if (!nextConfig.headers) nextConfig.headers = {};
          nextConfig.headers.Authorization = `Bearer ${auth.token}`;

          return nextConfig;
        },
      },
      response: {
        onError: (error) => {
          if (error.response) {
            switch (error.response.status) {
              case 401:
                // emitter.emit('unauthorized');
                break;
              default:
            }
          }
          return Promise.reject(error['response']?.data || error);
        },
      },
    },
  },
};

runApp(appConfig);
