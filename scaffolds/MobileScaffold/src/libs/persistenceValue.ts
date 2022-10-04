import { SetOptionStruct } from '@uni/storage/types/types';
import { getStorageSync, setStorage } from '@uni/storage';

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

  set value(payload) {
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
