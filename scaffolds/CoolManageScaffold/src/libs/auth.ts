import { getStorageSync, setStorageSync, removeStorageSync } from '@uni/storage';
import { getSearchParams } from 'ice';
import showErrMessage from './showErrMessage';
import axios from 'axios';

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

    // STEP: 从Params获取code
    const code = encodeURIComponent(String(getSearchParams()['code']));

    // STEP: 换取token
    const res = await axios.post<{ data: { token: string } }>('/api/authorization', { code });

    // STEP: 设置token
    this.setToken(res.data.data.token);
  }

  signOut() {
    this.removeToken();
  }
}

const auth = new Auth();

export default auth;
