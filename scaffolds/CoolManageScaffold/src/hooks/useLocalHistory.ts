import { useLocalStorageState, useMemoizedFn } from 'ahooks';
import { Options } from 'ahooks/lib/useControllableValue';

interface Item {
  label: string;
  value: string;
}
const useLocalHistory = (key, options?: Options<Item[]>) => {
  const [localHistory, setLocalHistory] = useLocalStorageState<Item[]>(key, {
    defaultValue: [],
    ...options,
  });

  const put = useMemoizedFn(({ value, label }: Partial<Item>) => {
    // NOTICE: 暂时只判断value
    if (!value || !value.replace(/ /, '') || !label) return;

    setLocalHistory((prev) => [
      { label, value: value },
      ...(prev || []).filter((item, itemIdx) => item.value !== value && itemIdx < 10),
    ]);
  });

  const remove = useMemoizedFn(({ value }: Omit<Item, 'label'>) => {
    // NOTICE: 暂时只判断value
    setLocalHistory((prev) => (prev || []).filter((childItem) => childItem.value !== value));
  });

  return [localHistory, { put, remove }] as const;
};

export default useLocalHistory;
