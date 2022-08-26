import axios from 'axios';
import queryString from 'query-string';
import { getStorageSync, setStorageSync, removeStorageSync } from '@uni/storage';
import { getEnv } from './env';

interface AuthWechatConfig {
  scope?: 'snsapi_userinfo' | 'snsapi_base';
  componentAppid?: string;
}

const ACCESS_TOKEN_KEY = 'access_token';

const request = axios.create();
request.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error) => Promise.reject(error.response?.data ?? error),
);

function generateWechatAuthLink({
  appId,
  scope = 'snsapi_base',
  componentAppid,
}: {
  appId: string;
  scope?: 'snsapi_userinfo' | 'snsapi_base';
  componentAppid?: string;
}) {
  return `https://open.weixin.qq.com/connect/oauth2/authorize?${queryString.stringify({
    appid: appId,
    scope,
    redirect_uri: queryString.exclude(location.href, ['code', 'state']),
    response_type: 'code',
    state: '',
    ...(componentAppid ? { component_appid: componentAppid } : {}),
  })}#wechat_redirect`;
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
  storageKey = ACCESS_TOKEN_KEY;
  wechatConfig: AuthWechatConfig = {};

  constructor({
    appId,
    storageKey,
    wechatConfig,
  }: {
    appId: string;
    storageKey?: string;
    wechatConfig?: AuthWechatConfig;
  }) {
    this.appId = appId;

    if (storageKey) this.storageKey = storageKey;
    if (wechatConfig) this.wechatConfig = wechatConfig;
  }

  // CANDO: 可以缓存一下，避免每次都从storage拿
  getAccessToken() {
    const { data: accessToken } = getStorageSync({
      key: this.storageKey,
    });
    return accessToken;
  }

  setAccessToken(accessToken: string) {
    setStorageSync({
      key: this.storageKey,
      data: accessToken,
    });
  }

  removeAccessToken() {
    removeStorageSync({
      key: this.storageKey,
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

    return accessToken;
  }

  public async requestLogin(code: string) {
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
      window.location.href = generateWechatAuthLink({
        appId: this.appId,
        ...this.wechatConfig,
      });
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
