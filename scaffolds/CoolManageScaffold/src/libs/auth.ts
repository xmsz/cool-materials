import { getStorageSync } from '@uni/storage';

class Auth {
  token: string;

  getToken() {
    return this.token;
  }

  init({ defaultStorageKey }: { defaultStorageKey: string }) {
    const { data: token } = getStorageSync({
      key: defaultStorageKey,
    });
    this.token = token;
  }
}

const auth = new Auth();
auth.init({
  defaultStorageKey: 'access_token',
});

export default auth;
