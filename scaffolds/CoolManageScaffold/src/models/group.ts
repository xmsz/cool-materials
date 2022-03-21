import { IGroup } from '@/interface';
import groupService from '@/service/group';
import { IRootState, IRootDispatch } from '@/store';

const state: { list: IGroup[] } = {
  list: [],
};
export default {
  state,
  reducers: {
    Update(prevState: { list: IGroup[] }, payload: { list: IGroup[] }) {
      return {
        ...prevState,
        ...payload,
      };
    },
  },
  effects: (dispatch: IRootDispatch) => ({
    async Refresh(payload: undefined, rootState: IRootState) {
      const group = await groupService.Search();
      dispatch.group.Update(group);
    },
  }),
};
