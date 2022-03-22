import PaginationPlus from '@/components/PaginationPlus';
import TablePlus from '@/components/TablePlus';
import useFusionTablePlus from '@/hooks/useFusionTablePlus';
import recordService from '@/service/record';
import { Field, Menu, MenuButton, Message, Select } from '@alifd/next';
import { ColumnProps } from '@alifd/next/types/table';
import PageHeadings from '@cool-in/material-page-headings';
import compShowApi from '@/libs/compShowApi';
import { RecordCreatePopup, RecordUpdatePopup } from '@/components/RecordForm';
import handleWrapper from '@/libs/handleWrapper';
import { IRecord } from '@/interface';
import { useEffect, useMemo } from 'react';
import useTableColumnVisible from '@/hooks/useTableColumnVisible';
import { useMemoizedFn } from 'ahooks';
import deleteConfirm from '@/libs/deleteConfirm';
import TableFilter from '@/components/TableFilter';
import { FilterOperations } from 'mongodb';
import equal from 'deep-is';
import { EFilterCommand } from '@/components/TableFilter/const';
import { GroupSelect } from '@/components/GroupForm';
import store from '@/store';
import { useParams, useRequest, useHistory } from 'ice';
import groupService from '@/service/group';
import PageHeadingsMoreButton from '@/components/PageHeadingsMoreButton';

const { SelectActionBar } = TablePlus.Header;

export default function Home() {
  const history = useHistory();

  // Params
  const paramsData = useParams<{ id: string }>();
  const groupId = useMemo(() => Number(paramsData.id), [paramsData.id]);

  // Store
  const [groupState, groupDispatchers] = store.useModel('group');

  // Form
  const field = Field.useField({ values: { $and: [] } });

  // Table
  const {
    data,
    paginationProps,
    tableProps,
    refreshAsync: refresh,
    search,
    params,
    runAsync: request,
  } = useFusionTablePlus(
    ({ pageSize, current }, filters?: { $and: Array<FilterOperations<Record<string, unknown>>> }) =>
      recordService.Search({ pageSize, page: current - 1, filters, groupId }),
    { field, manual: true },
  );

  // Columns
  const columns = useMemo<ColumnProps[]>(() => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        sortable: true,
      },
      {
        title: '名称',
        dataIndex: 'remark',
        cell: (...args: [string, number, IRecord, any]) =>
          TablePlus.Cells.TextQuickEdit(...args, {
            onOk: (value) =>
              handleWrapper(() => recordService.Update({ ...args[2], remark: value }), { onSuccess: refresh }),
          }),
      },
      {
        title: '短链地址',
        dataIndex: 'shortLink',
        cell: TablePlus.Cells.Link,
      },
      {
        title: '源链地址',
        dataIndex: 'link',
        cell: TablePlus.Cells.TextOverflow,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        cell: TablePlus.Cells.Date,
        sortable: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        cell: TablePlus.Cells.Date,
        sortable: true,
      },
      {
        cell: (value, rowIndex, record: IRecord) => (
          <div className="flex gap-3">
            <TablePlus.Actions.Edit
              onClick={() => {
                compShowApi(RecordUpdatePopup, { onSuccess: refresh, values: record });
              }}
            />
            <TablePlus.Actions.Delete
              onOk={() => {
                handleWrapper(() => recordService.Delete({ id: record.id }), { onSuccess: refresh });
              }}
            />
            <TablePlus.Actions.MenuButton iconClassName="i-ic-sharp-more-vert">
              <Menu.Item
                onClick={() => {
                  compShowApi(RecordCreatePopup, {
                    onSuccess: refresh,
                    defaultValues: record,
                  });
                }}
              >
                复制
              </Menu.Item>
            </TablePlus.Actions.MenuButton>
          </div>
        ),
      },
    ];
  }, [refresh]);
  const { columnVisibleProps, columnsVisible } = useTableColumnVisible({
    columns,
    storageKey: 'record#tableColumnVisibleKeys',
  });
  const filterProps = useMemo(() => {
    return {
      filters: [
        {
          name: '短链路径',
          field: 'key',
          commands: [EFilterCommand.EQUAL],
        },
        {
          name: '分组',
          field: 'groupId',
          commands: [EFilterCommand.EQUAL],
          form: () => <GroupSelect />,
          resultValueRender: (val) => groupState.list.find((item) => item.id === val)?.name,
        },
      ],
      value: params[1]?.['$and'] || [],
      onSubmit: (value) => {
        field.setValue('$and', [
          ...(field.getValue<[]>('$and') || []),
          {
            [value.field]: {
              [value.command]: value.value,
            },
          },
        ]);
        search.submit();
      },
      onRemove: (value) => {
        field.setValue(
          '$and',
          (field.getValue<[]>('$and') || []).filter(
            (item) =>
              !equal(item, {
                [value.field]: {
                  [value.command]: value.value,
                },
              }),
          ),
        );
        search.submit();
      },
    };
  }, [field, params, search]);

  // Actions
  const handleDeleteMany = useMemoizedFn((keys: Array<string | number>) => {
    deleteConfirm({
      onOk: () => {
        handleWrapper(async () => Promise.all(keys.map(async (id) => recordService.Delete({ id: Number(id) }))), {
          onSuccess: refresh,
        });
      },
    });
  });

  // Info
  const { data: info, request: requestInfo } = useRequest(groupService.Get);

  useEffect(() => {
    request({ current: 0, pageSize: 10 });
    requestInfo({ id: groupId });
  }, [groupId]);

  return (
    <>
      <div className="p-4 sm:p-6">
        <PageHeadings
          title={info?.name}
          desc={`共找到${data?.total}条记录`}
          extra={
            <PageHeadingsMoreButton>
              <MenuButton.Item
                onClick={async () => {
                  if (groupId === 0) return Message.warning('无法删除默认分组');

                  if (await deleteConfirm()) {
                    handleWrapper(() => groupService.Delete({ id: groupId }), {
                      onSuccess: async () => {
                        const res = await groupDispatchers.Refresh();
                        history.push({ pathname: `/record/${res.list[0]}` });
                      },
                    });
                  }
                }}
              >
                删除
              </MenuButton.Item>
            </PageHeadingsMoreButton>
          }
          actions={[
            {
              type: 'primary',
              children: '新建',
              onClick: () => {
                compShowApi(RecordCreatePopup, {
                  onSuccess: refresh,
                  defaultValues: {
                    groupId,
                    link: '',
                  },
                });
              },
            },
          ]}
        />
      </div>
      <div className="p-4 pt-2 sm:p-6 sm:pt-2">
        <div className="items-center justify-between pb-4 sm:flex">
          <TableFilter {...filterProps} />
          <div className="mt-3 sm:mt-0">
            <Select {...columnVisibleProps} />
          </div>
        </div>
        <TablePlus.Scroll
          hasBorder={false}
          columns={columnsVisible}
          // @ts-ignore type
          components={{
            Header: (props) => (
              <SelectActionBar {...props} selectedRowKeys={tableProps.rowSelection.selectedRowKeys}>
                <SelectActionBar.Button
                  icon="i-ic-sharp-delete"
                  onClick={() => {
                    handleDeleteMany(tableProps.rowSelection.selectedRowKeys);
                  }}
                >
                  删除
                </SelectActionBar.Button>
              </SelectActionBar>
            ),
          }}
          {...tableProps}
        />

        <div className="mt-4">
          <PaginationPlus.Between {...paginationProps} />
        </div>
      </div>
    </>
  );
}

// {
//   title: '名称',
//   dataIndex: 'name',
// },
// {
//   title: '布尔值',
//   dataIndex: 'boolean',
//   cell: TablePlus.Cells.Boolean,
// },
// {
//   title: '富文本',
//   dataIndex: 'richText',
//   cell: TablePlus.Cells.RichText,
// },
// {
//   title: '枚举',
//   dataIndex: 'enum',
//   cell: (value, rowIndex, record, context) =>
//     TablePlus.Cells.Enum(
//       value,
//       rowIndex,
//       record,
//       context,
//       {
//         0: {
//           color: '#1a56db',
//           bgColor: '#e1effe',
//           label: '正常',
//         },
//         1: {
//           color: '#046c4e',
//           bgColor: '#def7ec',
//           label: '成功',
//         },
//         2: {
//           color: '#c81e1e',
//           bgColor: '#fde8e8',
//           label: '失败',
//         },
//       }[value],
//     ),
// },
// {
//   title: '时间',
//   dataIndex: 'date',
//   cell: TablePlus.Cells.Date,
// },
