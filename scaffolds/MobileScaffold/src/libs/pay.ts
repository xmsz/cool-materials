import { getEnv } from './env';

export const requestPay: (payload?: {
  appId: string;
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}) => Promise<{ isPaid: boolean }> = (payload) => {
  if (!payload) return Promise.reject(new Error('未获得微信支付订单'));

  return new Promise((resolve, reject) => {
    function onBridgeReady() {
      WeixinJSBridge.invoke('getBrandWCPayRequest', payload, (res) => {
        const errMsg = res.errMsg || res.err_msg;

        if (errMsg.indexOf('ok') === -1) {
          // CONDI: 取消支付
          if (errMsg.indexOf('cancel') > -1) {
            resolve({ isPaid: false });
            return;
          }

          reject(new Error(errMsg));
          return;
        }

        resolve({ isPaid: true });
      });
    }

    if (getEnv() !== 'wechat-web') {
      reject(new Error('该环境不支持支付'));
      return;
    }

    if (typeof WeixinJSBridge === 'undefined') {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else {
      onBridgeReady();
    }
  });
};
