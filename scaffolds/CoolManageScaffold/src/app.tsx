import { runApp, IAppConfig } from 'ice';
import 'uno.css';
import auth from './libs/auth';

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
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
