import { useFusionTable } from 'ahooks';
import { Data, Params, Service } from 'ahooks/lib/useAntdTable/types';
import { FusionTableOptions, FusionTableResult } from 'ahooks/lib/useFusionTable/types';
import { useEffect, useMemo, useState } from 'react';
import equal from 'deep-is';

type useFusionTablePlus = <TData extends Data, TParams extends Params>(
  service: Service<TData, TParams>,
  options?: FusionTableOptions<TData, TParams> & {},
) => FusionTableResult<TData, TParams> & {
  tableProps: {
    rowSelection: {
      selectedRowKeys: (string | number)[];
      onChange: (selectedRowKeys: Array<string | number>) => void;
    };
  };
};

const useFusionTablePlus: useFusionTablePlus = (service, options = {}) => {
  const { tableProps: tablePropsOrigin, ...res } = useFusionTable(service, options);
  const [tableSort, setTableSort] = useState<Record<string, 'desc' | 'asc'>>({});
  const [tableSelectedRowKeys, setTableSelectedRowKeys] = useState<Array<string | number>>([]);

  const tableProps = useMemo(
    () => ({
      ...tablePropsOrigin,
      sort: tableSort,
      onSort: (dataIndex, order) => {
        const curTableSort = { [dataIndex]: order };
        setTableSort(curTableSort);
        //   // if (JSON.stringify(curTableSort) !== JSON.stringify(getInitialTableSort())) {
        //   //   updateSearchParams({
        //   //     sort: generateSearchSort({ field: dataIndex, order }),
        //   //   });
        //   // }
        return tablePropsOrigin.onSort(dataIndex, order);
      },
      rowSelection: {
        selectedRowKeys: tableSelectedRowKeys,
        onChange: (selectedRowKeys: Array<string | number>) => setTableSelectedRowKeys(selectedRowKeys),
      },
    }),
    [tablePropsOrigin, tableSelectedRowKeys],
  );

  useEffect(() => {
    // STEP: 清除不存在当前页面的选择项
    setTableSelectedRowKeys((prev) => {
      const next = prev.filter((item) =>
        tablePropsOrigin.dataSource.find((childItem) => childItem.id === item || childItem._id === item),
      );
      return equal(next, prev) ? prev : next;
    });
  }, [tablePropsOrigin.dataSource]);

  return { ...res, tableProps };
};

export default useFusionTablePlus;
