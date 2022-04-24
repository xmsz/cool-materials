import { storage } from '@uni/apis';
import { getSearchParams } from 'ice';
import showErrMessage from './showErrMessage';
import axios from 'axios';

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

// https://short-url.cpshelp.cn/?code=VWDbb6hr481zT2qHXzFjdtKX6Ohc%2BQ6UbrxQcFEle4Lpqm5mMB%2BG68HTggYbGCoQ6My%2BFRw8Bsc9nDZ2Zv%2BwWdISP5LGx9xiTP0t7Ivt7LhtZeyf93OA8EtgKJC22MQTlKN4A9NKzHuRD0c%2Bm1WcWjZcN6DYW0H6nFFflbCyjtw%3D
