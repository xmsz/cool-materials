import { SetOptionStruct } from '@uni/storage/types/types';
import { getStorageSync, setStorage, removeStorageSync } from '@uni/storage';

export default class PersistenceValue<T extends SetOptionStruct['data']> {
  private _value: T;
  private key: string;

  constructor(key: string) {
    this.key = key;
    this._value = getStorageSync({ key }).data;
  }

  get value() {
    return this._value;
  }

  set value(payload: T | undefined) {
    if (typeof payload === 'undefined') {
      // @ts-ignore
      this._value = undefined;
      removeStorageSync({ key: this.key });

      return;
    }
    this._value = payload;
    setStorage({
      key: this.key,
      data: payload,
    });
  }

  // remove() {
  //   removeStorageSync({
  //     key: this.key,
  //   });
  // }
}
