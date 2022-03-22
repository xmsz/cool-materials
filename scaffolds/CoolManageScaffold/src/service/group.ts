import { IGroup, IGroupCreateReq, IGroupSearchReply } from '@/interface';
import { request } from 'ice';

const groupService = {
  async Create(payload: IGroupCreateReq) {
    const { data } = await request.post<{ data: IGroup }>('/api/url/group/insert', payload);

    return data;
  },
  async Search() {
    const { data } = await request.get<IGroupSearchReply>('/api/url/group/find');

    return data;
  },
  async Get({ id }: { id: number }) {
    const { data } = await request.get<{ data: IGroup }>('/api/url/group/get_by_id', {
      params: {
        id,
      },
    });

    return data;
  },
  async Delete({ id }: { id: number }) {
    const { data } = await request.post<{ data: IGroup }>('/api/url/group/delete', {
      id,
    });

    return data;
  },
};

export default groupService;
