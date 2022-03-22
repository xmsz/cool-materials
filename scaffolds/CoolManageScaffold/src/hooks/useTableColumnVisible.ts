import { SelectProps } from '@alifd/next/types/select';
import { ColumnProps } from '@alifd/next/types/table';
import { useLocalStorageState } from 'ahooks';
import { useMemo } from 'react';

export default ({ columns, storageKey }: { columns: ColumnProps[]; storageKey: string }) => {
  const [columnVisibleKeys, setColumnVisibleKeys] = useLocalStorageState<string[]>(storageKey);
  const columnVisibleProps = useMemo(() => {
    const columnKeys = columns
      .filter((item) => item.dataIndex)
      .map((item) => ({ label: item.title, value: item.dataIndex }));

    const result: SelectProps = {
      value: columnVisibleKeys || columnKeys.map((item) => item.value),
      dataSource: columnKeys,
      onChange: setColumnVisibleKeys,
      maxTagPlaceholder: (selectedValues) => `${selectedValues?.length}列已显示`,
      mode: 'multiple',
      maxTagCount: 0,
      autoWidth: false,
      popupProps: {
        v2: true,
        placement: 'br',
      },
      className: 'next-no-tag-style',
    };
    return result;
  }, [columnVisibleKeys, columns, setColumnVisibleKeys]);
  const columnsVisible = useMemo(() => {
    if (!columnVisibleKeys) return columns;
    return columns.filter((item) => (item.dataIndex && columnVisibleKeys.includes(item.dataIndex)) || !item.dataIndex);
  }, [columns, columnVisibleKeys]);

  return {
    columnVisibleProps,
    columnsVisible,
  };
};
