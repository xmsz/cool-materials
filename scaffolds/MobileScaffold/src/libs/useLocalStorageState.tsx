import { useState } from 'rax';
import { getStorageSync, setStorageSync } from '@uni/storage';
import { useMemoizedFn } from 'ahooks';
import { SetSyncOptionStruct } from '@uni/storage/types/types';
import { usePageShow } from 'rax-app';

function useLocalStorageState<T extends SetSyncOptionStruct['data']>(
  key: string,
  options: { defaultValue?: T; refreshOnPageShow?: boolean },
) {
  const [value, setValueOrigin] = useState<T>(() => getStorageSync({ key }).data || options.defaultValue);
  const setValue = useMemoizedFn((data: T) => {
    setStorageSync({ key, data });
    setValueOrigin(data);
  });

  usePageShow(() => {
    if (!options.refreshOnPageShow) return;
    setValue(getStorageSync({ key }).data || options.defaultValue);
  });
  return [value, setValue] as const;
}
export default useLocalStorageState;
