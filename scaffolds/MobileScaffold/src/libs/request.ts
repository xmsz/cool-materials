// TODO: 替换wx.reLaunch to uni
import { isWeb } from '@uni/env';
import axios, { AxiosRequestConfig } from 'axios';
import mpAdapter from 'axios-miniprogram-adapter';
import { config as appConfig } from 'rax-app';
import { token } from './token';

const request = axios.create({
  adapter: isWeb ? undefined : mpAdapter,
});

request.interceptors.request.use(
  (config) => {
    if (!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token.value}`;
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
  (response) => {
    return Promise.resolve(response.data);
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // emitter.emit('unauthorized');
          token.value = undefined;
          wx.reLaunch({ url: '/pages/Home/index' });
          break;
        default:
      }
    }
    return Promise.reject(error['response']?.data || error);
  },
);

export default {
  post: request.post as <T = any, R = T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) => Promise<R>,
};
