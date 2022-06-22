import axios from 'axios';
import queryString from 'query-string';
import { getStorageSync, setStorageSync, removeStorageSync } from '@uni/storage';
import { getEnv } from './env';
import { getAppId } from '../config';

const ACCESS_TOKEN_KEY = 'access_token';

const request = axios.create();
request.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error) => Promise.reject(error.response?.data ?? error),
);

function generateWechatAuthLink({ appId }: { appId: string }) {
  const url = new URL(location.href);

  // STEP: 去除code和state
  const parsed = queryString.parse(url.search);
  delete parsed.code;
  delete parsed.state;
  const stringified = queryString.stringify(parsed);
  url.search = stringified;

  const queryStringified = queryString.stringify({
    appid: appId,
    redirect_uri: decodeURIComponent(url.href),
    response_type: 'code',
    scope: 'snsapi_userinfo',
    state: '',
  });
  const jumpUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?${queryStringified}#wechat_redirect`;

  return jumpUrl;
}

const getParams = () => {
  return {
    ...queryString.parse(location.search),
    ...queryString.parse(location.hash.replace('/?', '')),
  };
};

export class Auth {
  env = getEnv();
  appId = '';

  init({ appId }: { appId: string }) {
    this.appId = appId;
  }

  // CANDO: 可以缓存一下，避免每次都从storage拿
  getAccessToken() {
    const { data: accessToken } = getStorageSync({
      key: ACCESS_TOKEN_KEY,
    });
    return accessToken;
  }

  setAccessToken(accessToken: string) {
    setStorageSync({
      key: ACCESS_TOKEN_KEY,
      data: accessToken,
    });
  }

  removeAccessToken() {
    removeStorageSync({
      key: ACCESS_TOKEN_KEY,
    });
  }

  async login() {
    let accessToken = '';

    const getHandler = () => {
      const handers = [
        {
          reg: () => this.env === 'wechat-web',
          handler: () => this.wechatWebLogin(),
        },
      ];
      return handers.find((item) => item.reg())?.handler;
    };

    const handler = getHandler();
    if (!handler) {
      // eslint-disable-next-line no-console
      console.warn('auth.login:', '未找到该环境处理函数');
      return;
    }

    accessToken = await handler();

    // STEP: 储存在本地
    if (accessToken) this.setAccessToken(accessToken);
  }

  private async requestLogin(code: string) {
    const urlParams = getParams();
    const { invite_code: inviteCode } = urlParams;
    const { appId } = this;

    const res = await request.post<{
      data: {
        token: string;
      };
    }>('/api/user/authorization', {
      code,
      env: this.env,
      inviteCode,
      officialAppId: appId,
    });

    return { accessToken: res.data.data.token };
  }

  private async wechatWebLogin(): Promise<string> {
    const urlParams = getParams();
    const { code: codeFromParams } = urlParams;
    const code = codeFromParams && typeof codeFromParams === 'object' ? codeFromParams[0] : codeFromParams;

    const jumpToWechatAuth = () => {
      window.location.href = generateWechatAuthLink({ appId: this.appId });
    };
    if (code) {
      try {
        const res = await this.requestLogin(code);
        return res.accessToken;
      } catch (err: any) {
        // 40163: code been used || 40029: invalid code 【危险 可能造成无限循环】
        if (err.code === 40163 || err.code === 40029) {
          // CANDO: 避免疯狂调整
          // CONDI: code过期 => 直接跳转
          jumpToWechatAuth();
          return '';
        }
        return Promise.reject(err);
      }
    }

    // STEP: 跳转到微信授权页
    jumpToWechatAuth();

    return '';
  }
}

const auth = new Auth();

auth.init({
  appId: getAppId(),
});

export default auth;
