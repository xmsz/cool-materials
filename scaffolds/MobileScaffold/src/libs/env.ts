import { isWeb, isWeChatMiniProgram } from '@uni/env';

export const isWechatWeb = isWeb && /MicroMessenger/i.test(window.navigator.userAgent);
// eslint-disable-next-line @iceworks/best-practices/recommend-polyfill
const urlParams = new URLSearchParams(location.search);

const envObj: Record<'wechat-web' | 'web' | 'wechat-miniprogram', boolean> = {
  'wechat-web': isWechatWeb,
  web: isWeb,
  'wechat-miniprogram': isWeChatMiniProgram,
};
const envObjKeys = Object.keys(envObj) as Array<keyof typeof envObj>;
export const getEnv = () => {
  let result: keyof typeof envObj | 'unknown' = 'unknown';
  for (let i = 0, len = envObjKeys.length; i < len; i += 1) {
    const key = envObjKeys[i];
    if (envObj[key]) {
      result = key;
      break;
    }
  }
  return result;
};

export const isFeature = () => urlParams.get('feature');

// @ts-ignore process node type
export const isDev = process.env.NODE_ENV === 'development';
