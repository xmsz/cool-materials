import { CronPlanService } from '@/services/cronPlan';
import { Button, Dialog, Divider, MenuButton, Pagination, Table } from '@alifd/next';
import { useFusionTable, useMemoizedFn } from 'ahooks';
import { CronPlan } from '@/interface';
import Edit from '../Edit';
import handleWrapper from '@/libs/handleWrapper';
import Detail from '../Detail';

type IRecord = CronPlan;

function List() {
  const { tableProps, paginationProps, refreshAsync } = useFusionTable(async ({ current, pageSize }) => {
    const res = await CronPlanService.List({ pageSize, page: current - 1 });
    return res;
  });

  const handleAdd = useMemoizedFn(() => {
    Edit.add({
      onSuccess: refreshAsync,
    });
  });
  const handleEdit = useMemoizedFn((record: IRecord) => {
    Edit.edit({
      onSuccess: refreshAsync,
      id: record.id,
    });
  });
  const handleDetail = useMemoizedFn((record: IRecord) => {
    Detail.show({
      id: record.id,
      onRefresh: refreshAsync,
    });
  });
  const handleDelete = useMemoizedFn((record: IRecord) => {
    const onOk = () => {
      handleWrapper(CronPlanService.Delete, {
        payload: {
          id: record.id,
        },
        onSuccess: refreshAsync,
      });
    };
    Dialog.confirm({
      title: '确认删除计划？',
      okProps: {
        children: '确认',
        warning: true,
      },
      onOk,
      closeMode: [],
    });
  });

  return (
    <div className="px-6 py-5">
      <header className="mb-1">
        <b className="text-xl text-gray-900 ">默认群发</b>
      </header>
      <div className="flex items-center justify-between">
        <div className="py-4 flex gap-3">
          <Button type="primary" onClick={handleAdd}>
            <i className="ic-round md-add -ml-1.5 mr-0.5 text-base" />
            创建计划
          </Button>
        </div>
      </div>

      <Table hasBorder={false} {...tableProps}>
        <Table.Column
          title="计划名称"
          dataIndex="name"
          cell={(val, index, record) => {
            return (
              <Button
                text
                onClick={() => {
                  handleDetail(record);
                }}
              >
                <span className="text-[13px]">{val}</span>
              </Button>
            );
          }}
        />
        <Table.Column
          title="操作"
          cell={(val, index, record: IRecord) => {
            return (
              <div>
                <Button
                  type="primary"
                  text
                  onClick={() => {
                    handleDetail(record);
                  }}
                >
                  详情
                </Button>
                <Divider direction="ver" />
                <Button
                  type="primary"
                  text
                  onClick={() => {
                    handleEdit(record);
                  }}
                >
                  编辑
                </Button>
                <Divider direction="ver" />
                <MenuButton label="更多" text type="primary">
                  <MenuButton.Item
                    onClick={() => {
                      handleDelete(record);
                    }}
                    className="text-red-500"
                  >
                    删除
                  </MenuButton.Item>
                </MenuButton>
              </div>
            );
          }}
        />
      </Table>

      <footer className="py-4 flex justify-end">
        <Pagination {...paginationProps} size="small" shape="arrow-only" />
      </footer>
    </div>
  );
}

export default List;
