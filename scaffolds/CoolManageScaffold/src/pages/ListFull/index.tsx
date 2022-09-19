import CorpWeMemberSelect from '@/components/CorpWeMemberPicker';
import CorpWeSelect from '@/components/CorpWeSelect';
import handleWrapper from '@/libs/handleWrapper';
import QwService from '@/protobuf/js/api/wx/qw/qw_http_pb';
import { LxwItem, LxwUpdateRequest } from '@/protobuf/js/api/wx/qw/qw_pb';
import {
  Button,
  Checkbox,
  Dialog,
  Divider,
  Drawer,
  Form,
  Input,
  MenuButton,
  Pagination,
  Radio,
  Table,
  Switch,
  ConfigProvider,
  Field,
} from '@alifd/next';
import { useFusionTable, useMemoizedFn, useMount, useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';

type IRecord = LxwItem;
type IEditValues = LxwUpdateRequest;

const EditDialogProps = {
  headerStyle: {
    position: 'sticky',
    top: 0,
  },
};

const MemberListFormRaw = <Record extends { memberId: number; state: boolean }>(props: {
  value?: Record[];
  onChange?: (payload: Record[]) => void;
  isPreview?: boolean;
  onRecordChange?: (item: Record) => void;
  corpWeId: number;
}) => {
  const { data: memberList } = useRequest(
    async () => {
      if (!props.value) return { list: [] };

      const res = await QwService.QwMemberList({ qwId: props.corpWeId, pageSize: 999 });
      return {
        ...res,
        list: res.list?.filter(
          (item) => item.id && props.value?.map((childItem) => childItem.memberId).includes(item.id),
        ),
      };
    },
    {
      refreshDeps: [props.value, props.corpWeId],
    },
  );

  const Add = useMemoizedFn(() => {
    let value = null;
    Dialog.show({
      title: '新增',
      content: (
        <CorpWeMemberSelect
          corpWeId={props.corpWeId}
          className="w-full"
          onChange={(curValue) => (value = curValue)}
          dataSourceFilter={(payload) =>
            payload?.map((item) => ({
              ...item,
              disabled: props.value?.map((childItem) => childItem.memberId).includes(item.value),
            }))
          }
        />
      ),
      closeMode: [],
      onOk: () => {
        if (!value) return;
        props.onChange?.([...(props.value || []), { memberId: value, state: true } as unknown as Record]);
      },
    });
  });

  return (
    <>
      {!props.isPreview && (
        <Button className="mb-3 mt-2" type="primary" onClick={Add}>
          新增
        </Button>
      )}
      <div className="overflow-auto rounded-lg border border-gray-200">
        <Table dataSource={props.value} hasBorder={false}>
          <Table.Column
            title="开启状态"
            dataIndex="state"
            cell={(val: Record['state'], index: number, record: Record) => (
              <Switch
                size="small"
                checked={val}
                className="scale-90"
                onChange={(value) => {
                  if (!props.value) return;
                  const newRecord = { ...record, state: value };
                  props.onRecordChange?.(newRecord);
                  props.onChange?.(props.value.map((item, itemIdex) => (itemIdex === index ? newRecord : item)));
                }}
              />
            )}
            width={100}
          />
          <Table.Column
            title="成员"
            dataIndex="memberId"
            cell={(val: Record['memberId']) => {
              return memberList?.list?.find((item) => item.id === val)?.name;
            }}
          />

          {!props.isPreview && (
            <Table.Column
              title="操作"
              lock="right"
              width={120}
              cell={(value, index: number, record: Record) => {
                return (
                  <div>
                    {/* <Button
                      text
                      onClick={() => {
                        edit(record);
                      }}
                    >
                      编辑
                    </Button>
                    <Divider direction="ver" /> */}
                    <Button
                      text
                      onClick={() => {
                        if (!props.value) return;
                        props.onChange?.(props.value.filter((item, itemIdx) => itemIdx !== index));
                      }}
                    >
                      删除
                    </Button>
                  </div>
                );
              }}
            />
          )}
        </Table>
      </div>
    </>
  );
};
const MemberListForm = ConfigProvider.config(MemberListFormRaw) as typeof MemberListFormRaw;

const EditorFormContent = ({ corpWeId }: { corpWeId: number }) => {
  return (
    <>
      <Form.Item label="名称" name="remark">
        <Input defaultValue={dayjs().format('活码 YYYY-MM-DD HH:mm:ss')} />
      </Form.Item>
      <Form.Item label="成员" name="memberList" fullWidth required asterisk={false}>
        <MemberListForm corpWeId={corpWeId} />
      </Form.Item>
      <Form.Item
        name="skipVerify"
        label="自动通过验证"
        labelAlign="left"
        labelCol={{ span: 4 }}
        labelTextAlign="left"
        extra="开启后，粉丝添加成员时自动通过验证"
      >
        <Switch size="small" className=" scale-75" />
      </Form.Item>

      <Form.Item name="isExclusive" className="hidden">
        <Checkbox defaultChecked>同一个用户仅可添加一个客服</Checkbox>
      </Form.Item>
      <Form.Item name="type" className="hidden">
        <Radio.Group
          defaultValue={2}
          dataSource={[
            {
              label: '单人',
              value: 1,
            },
            {
              label: '多人',
              value: 2,
            },
          ]}
        />
      </Form.Item>
    </>
  );
};

const Edit = ({
  corpWeId,
  defaultValue,
  isUpdate,
  onMount,
}: {
  corpWeId: number;
  defaultValue?: IEditValues;
  isUpdate?: boolean;
  onMount?: (payload: { field: Field; submit: () => void }) => void;
}) => {
  const field = Field.useField({
    values: defaultValue,
  });

  const submit = useMemoizedFn(async () => {
    const valuesRes = await field.validatePromise();
    if (valuesRes.errors) return Promise.reject(valuesRes.errors);
    const values = valuesRes.values as {
      type: number;
      isExclusive: boolean;
      memberList: Array<{
        memberId: number;
        state: boolean;
      }>;
      skipVerify?: boolean;
      remark: string;
    };

    return new Promise((onSuccess, onError) => {
      if (isUpdate) {
        handleWrapper(QwService.LxwUpdate, {
          payload: {
            qwId: corpWeId,
            ...values,
          },
          onSuccess,
          onError,
        });
        return;
      }
      handleWrapper(QwService.LxwAdd, {
        payload: {
          qwId: corpWeId,
          scene: 2,
          ...values,
        },
        onSuccess,
        onError,
      });
    });
  });

  useMount(() => {
    onMount?.({ field, submit });
  });

  return (
    <Form field={field}>
      <EditorFormContent corpWeId={corpWeId} />
    </Form>
  );
};

function CorpWeExtContact() {
  const [corpWeId, setCorpWeId] = useState(-1);
  const { tableProps, paginationProps, refreshAsync, runAsync } = useFusionTable(
    async ({ current, pageSize }) => {
      const res = await QwService.LxwList({
        qwId: corpWeId,
      });
      return { ...(res as Required<typeof res>), total: res.list?.length || 0 };
    },
    {
      manual: true,
    },
  );

  const handleDelete = useMemoizedFn((record: IRecord) => {
    Dialog.confirm({
      title: '确认删除',
      onOk: () =>
        handleWrapper(QwService.LxwDel, {
          payload: {
            id: record.id,
          },
          onSuccess: refreshAsync,
        }),
    });
  });

  const handleEdit = useMemoizedFn(
    ({ isUpdate, defaultValue }: { isUpdate?: boolean; defaultValue?: IEditValues } = {}) => {
      let ref: { submit: () => void };
      const inst = Drawer.show({
        ...EditDialogProps,
        width: 700,
        title: (
          <div className="flex items-center justify-between -my-2 w-full">
            {isUpdate ? '编辑' : '创建'}活码
            <Button
              onClick={async () => {
                await ref.submit();
                refreshAsync();
                inst.hide();
              }}
            >
              保存
            </Button>
          </div>
        ),
        // @ts-ignore type
        content: (
          <Edit
            corpWeId={corpWeId}
            onMount={(payload) => (ref = payload)}
            defaultValue={defaultValue}
            isUpdate={isUpdate}
          />
        ),
      });
    },
  );

  useEffect(() => {
    runAsync({ pageSize: 9999, current: 1 });
  }, [corpWeId]);

  return (
    <div className="px-6 py-5">
      <header className="mb-1">
        <b className="text-xl text-gray-900 ">
          <CorpWeSelect
            className="mr-4 min-w-[160px]"
            value={corpWeId}
            onLoad={() => {
              console.log('onLoad');
            }}
            onDataLoad={(res) => {
              if (res.list?.[0].id) setCorpWeId(res.list?.[0].id);
            }}
            onChange={(value: number) => {
              setCorpWeId(value);
            }}
            innerBefore={<span className="pl-2 font-normal">企微:</span>}
            autoWidth
          />
          活码列表
        </b>
      </header>
      <div className="flex items-center justify-between">
        <div className="py-4 flex gap-3">
          <Button type="primary" onClick={() => handleEdit()}>
            创建活码
          </Button>
        </div>
      </div>

      <Table hasBorder={false} {...tableProps}>
        <Table.Column title="名称" dataIndex="remark" width={200} />
        <Table.Column
          title="二维码"
          dataIndex="qrCode"
          cell={(val) => {
            let viewer: Viewer;
            return (
              <img
                src={val}
                className="w-16 h-auto cursor-pointer "
                onLoad={(e) => {
                  viewer = new Viewer(e.target as HTMLElement, {
                    navbar: false,
                    title: false,
                    toolbar: {
                      download: function () {
                        window.open(
                          `https://1079952445790232.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/get_img/download_img/?url=${val}`,
                        );
                      },
                    },
                  });
                }}
                onClick={async (e) => {
                  viewer?.show();
                }}
              />
            );
          }}
          width={120}
        />
        <Table.Column
          title="成员"
          dataIndex="memberList"
          cell={(value: IRecord['memberList']) => {
            return (
              <div className="text-xs text-gray-700 flex flex-wrap gap-2">
                {value
                  ?.filter((item) => item.state)
                  .map((item) => (
                    <article key={item.memberId} className="mb-1">
                      {item.name}
                    </article>
                  ))}
              </div>
            );
          }}
        />

        <Table.Column
          title="操作"
          cell={(value, index, record: IRecord) => {
            return (
              <div>
                <Button
                  text
                  onClick={() => {
                    window.open(
                      `https://1079952445790232.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/get_img/download_img/?url=${record.qrCode}`,
                    );
                  }}
                >
                  下载
                </Button>
                <Divider direction="ver" />

                <Button
                  text
                  onClick={() => {
                    handleEdit({ isUpdate: true, defaultValue: record });
                  }}
                >
                  编辑
                </Button>

                <Divider direction="ver" />
                <MenuButton label="更多" text>
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

export default CorpWeExtContact;
