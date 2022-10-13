import { Button, Drawer } from '@alifd/next';
import { useMount, useRequest } from 'ahooks';
import Edit from '../Edit';
import { CronPlanService } from '@/services/cronPlan';

interface DetailProps {
  id: number;
  onMount?: (payload: { refresh: () => void }) => void;
  onRefresh?: () => void;
}

const Detail = ({ id, onMount }: DetailProps) => {
  const { refreshAsync } = useRequest(CronPlanService.Detail, {
    defaultParams: [{ id }],
  });
  useMount(() => {
    onMount?.({ refresh: refreshAsync });
  });

  return (
    <div>
      <Edit type="preview" />
    </div>
  );
};

Detail.show = async (props: DetailProps) => {
  const { id } = props;

  let ref: Parameters<Required<DetailProps>['onMount']>[0];
  const inst = Drawer.show({
    title: (
      <div className="flex items-center justify-between -my-2 w-full">
        推送计划详情
        <Button
          type="primary"
          onClick={() => {
            Edit.edit({
              id,
              onSuccess: () => {
                ref.refresh();
                props.onRefresh?.();
              },
            });
          }}
        >
          编辑
        </Button>
      </div>
    ),
    width: '100%',
    bodyStyle: {
      backgroundColor: '#f7f6fa',
    },
    content: (
      <Detail
        {...props}
        //   defaultValue={defaultValue}
        onMount={(payload) => {
          ref = payload;
          props.onMount?.(payload);
        }}
        //   onSuccess={() => {
        //     inst.hide();
        //     props.onSuccess?.();
        //   }}
      />
    ),
  });

  return inst;
};

export default Detail;
