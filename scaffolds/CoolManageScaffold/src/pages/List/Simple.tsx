import { Button, Pagination, Table } from '@alifd/next';
import { useFusionTable } from 'ahooks';

type Record = {};

function List() {
  const { tableProps, paginationProps, refreshAsync } = useFusionTable(async ({ current, pageSize }) => {
    // const res = await XcxService.List({ pageSize, page: current - 1 });
    // return { ...(res as Required<ListReply>) };
    return {
      list: [],
      total: 0,
    };
  });

  return (
    <div className="px-6 py-5">
      <header className="mb-1">
        <b className="text-xl text-gray-900 ">列表</b>
      </header>
      <div className="flex items-center justify-between">
        <div className="py-4 flex gap-3">
          <Button type="primary" onClick={refreshAsync}>
            新增
          </Button>
        </div>
      </div>

      <Table hasBorder={false} {...tableProps}>
        <Table.Column title="名称" dataIndex="title" />
      </Table>
      <footer className="py-4 flex justify-end">
        <Pagination {...paginationProps} size="small" shape="arrow-only" />
      </footer>
    </div>
  );
}

export default List;
