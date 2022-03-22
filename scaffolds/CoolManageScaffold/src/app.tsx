import { runApp, IAppConfig } from 'ice';
import 'uno.css';
import auth from './libs/auth';
import groupService from './service/group';

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
    getInitialData: async (ctx) => {
      const group = await groupService.Search();

      return {
        initialStates: {
          group,
        },
      };
    },
  },
  request: {
    interceptors: {
      request: {
        onConfig: (config) => {
          const nextConfig = { ...config };
          if (!nextConfig.headers) nextConfig.headers = {};
          nextConfig.headers.Authorization = `Bearer ${auth.getToken()}`;

          return nextConfig;
        },
      },
    },
  },
};

runApp(appConfig);
