import { isWeb } from '@uni/env';
import axios, { AxiosRequestConfig } from 'axios';
import mpAdapter from 'axios-miniprogram-adapter';
import { config as appConfig } from 'rax-app';

const request = axios.create({
  adapter: isWeb ? undefined : mpAdapter,
});

request.interceptors.request.use(
  async (config) => {
    if (!config.headers) config.headers = {};
    if (!isWeb) {
      config.url = `${appConfig.baseUrl}${config.url}`;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);
request.interceptors.response.use(
  async (res) => {
    return res.data;
  },
  (err) => {
    return Promise.reject(err);
  },
);

export default {
  post: request.post as <T = any, R = T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) => Promise<R>,
};
