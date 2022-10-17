import { ISolutionPlanUpdateReq, SolutionPlan } from '@/interface';
import showErrMessage from '@/libs/showErrMessage';
import { SolutionPlanService } from '@/services/solutionPlan';
import { Balloon } from '@alifd/next';
import { MessageProps } from '@alifd/next/types/message';
import { IPageRootDispatch, IPageRootState } from '../store';

const DefaultState: {
  current: number;
  list: SolutionPlan[];
  data?: SolutionPlan;
  updateMessageProps?: MessageProps;
} = {
  current: 0,
  list: [],
};

export default {
  state: DefaultState,
  effects: (dispatch: IPageRootDispatch) => ({
    runList: async () => {
      const res = await SolutionPlanService.List({});
      dispatch.setting.setState({ list: res.list });
      return res;
    },
    refreshList: async () => {
      return dispatch.setting.runList();
    },
    run: async (payload: undefined, rootState: IPageRootState) => {
      const res = await SolutionPlanService.Detail({ id: rootState.setting.current });
      dispatch.setting.setState({ data: res });
    },
    refresh: async () => {
      return dispatch.setting.run();
    },
    setCurrent: async (payload: number, rootState: IPageRootState) => {
      dispatch.setting.setState({ current: payload, updateMessageProps: undefined });
      dispatch.setting.run();
    },
    update: async (
      {
        updateMessage = true,
        ...payload
      }: ISolutionPlanUpdateReq & {
        updateMessage?: boolean;
      },
      rootState: IPageRootState,
    ) => {
      updateMessage &&
        dispatch.setting.setState({
          updateMessageProps: {
            type: 'loading',
            children: '保存中',
          },
        });

      try {
        await SolutionPlanService.Update(payload);
        updateMessage &&
          dispatch.setting.setState({
            updateMessageProps: {
              type: 'success',
              children: '保存成功',
            },
          });
        dispatch.setting.refresh();
        dispatch.setting.refreshList();
      } catch (err) {
        const errMsg = showErrMessage(err);

        updateMessage &&
          dispatch.setting.setState({
            updateMessageProps: {
              type: 'error',
              children: <Balloon.Tooltip trigger={'保存失败'}>{errMsg}</Balloon.Tooltip>,
            },
          });
      }
      // TODO 一种保存中

      //     debounceWait: 300,
    },
  }),
};
