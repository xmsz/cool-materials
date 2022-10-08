import { useMount } from 'ahooks';
import { createElement, PropsWithChildren, useState } from 'rax';
import showErrMessage from '@/libs/showErrMessage';
import { isWeChatMiniProgram } from '@uni/env';
import { promisify } from '@/libs/promisify';
import { AuthService } from '@/services/auth';
import { token } from '@/libs/token';

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
        setIsLogin(isLogin);
      })
      .catch(showErrMessage)
      .finally(() => {
        setIsLogin(true);
      });
  });

  return <>{isLogin ? children : null}</>;
};

export default Auth;
