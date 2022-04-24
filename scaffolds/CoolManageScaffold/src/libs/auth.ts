import { storage } from '@uni/apis';
import showErrMessage from './showErrMessage';

const { getStorageSync, removeStorageSync, setStorageSync } = storage;

class Auth {
  token: string | null;
  private storageKey = 'access_token';

  constructor() {
    try {
      this.token = getStorageSync({
        key: this.storageKey,
      }).data;
    } catch (err) {
      showErrMessage(err);
    }
  }

  removeToken() {
    this.token = null;
    removeStorageSync({ key: this.storageKey });
  }

  setToken(data: string) {
    this.token = data;
    setStorageSync({ key: this.storageKey, data });
  }

  async signIn() {
    if (this.token) return;
    console.log('signIn');

    // const { code } = await login({});
    // const signInRes = await UserService.MiniProgramLogin({ jsCode: code });
    // if (signInRes.token) this.setToken(signInRes.token);
  }

  signOut() {
    this.removeToken();
  }
}

const auth = new Auth();

export default auth;
