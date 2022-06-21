import axios from 'axios';
import auth from './auth';
import emitter from './emitter';

const request = axios.create({});

request.interceptors.request.use(
  (prevConfig) => {
    const config = { ...prevConfig };
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${auth.getAccessToken()}`;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

request.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          emitter.emit('unauthorized');
          break;
        default:
      }
    }
    return Promise.reject(error['response']?.data || error);
  },
);

export default request;
