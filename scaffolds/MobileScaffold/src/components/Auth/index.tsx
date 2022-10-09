import { useMount } from 'ahooks';
import { createElement, PropsWithChildren, useState } from 'rax';
import { getErrMessage } from '@/libs/showErrMessage';
import { isWeChatMiniProgram } from '@uni/env';
import { promisify } from '@/libs/promisify';
import { AuthService } from '@/services/auth';
import { token } from '@/libs/token';
import { Dialog } from '@alifd/meet';
import { history } from 'rax-app';

async function login() {
  const result = {
    isLogin: !!token.value,
  };

  if (result.isLogin) return result;

  if (isWeChatMiniProgram) {
    const loginAsync = promisify(wx.login);

    // STEP: 小程序
    const loginRes = await loginAsync({});

    // STEP: 进行登录
    const res = await AuthService.Login(loginRes);
    token.value = res.token;

    result.isLogin = true;

    return result;
  } else {
    console.log('网页暂不支持登录');
  }

  return result;
}

const Auth = ({ children }: PropsWithChildren<{}>) => {
  const [isLogin, setIsLogin] = useState(false);

  useMount(() => {
    // STEP: 登录
    login()
      .then(({ isLogin }) => {
        console.log(1, isLogin);
        setIsLogin(isLogin);
      })
      .catch((err) => {
        const errMsg = getErrMessage(err);
        Dialog.show({
          title: '登录失败',
          content: errMsg,
          okProps: {
            text: '重新登录',
          },
          onOk: () => {
            history?.replace('/list');
          },
        });
      })
      .finally(() => {
        // setIsLogin(true);
      });
  });

  return <>{isLogin ? children : null}</>;
};

export default Auth;
