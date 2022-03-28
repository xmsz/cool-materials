import {
  IRecordCreateReply,
  IRecordCreateReq,
  IRecordDeleteReply,
  IRecordDeleteReq,
  IRecordSearchReply,
  IRecordUpdateReply,
  IRecordUpdateReq,
} from '@/interface';
import { Filter } from 'mongodb';
import { request } from 'ice';

const recordService = {
  async Search({
    page,
    pageSize,
    filters,
    groupId: groupIdFromReq,
  }: {
    pageSize?: number;
    page?: number;
    filters?: { $and: Array<Filter<Record<string, unknown>>> };
    groupId: number;
  }) {
    let groupId = groupIdFromReq ?? -1;
    let key = undefined;
    if (filters) {
      filters.$and.forEach((item) => {
        const field = Object.keys(item)[0];
        if (!item[field]) return;
        const command = Object.keys(item[field]!)[0];
        const value = item[field]![command];

        if (field === 'key') {
          key = value;
        } else if (field === 'groupId') {
          groupId = value;
        }
      });
    }

    const { data } = await request.get<IRecordSearchReply>('/api/url/find', {
      params: {
        group_id: groupId,
        page_size: pageSize,
        page,
        key,
      },
    });

    return data;

    // return {
    //   list: [
    //     {
    //       id: '1',
    //       name: '名称',
    //       boolean: true,
    //       richText:
    //         '备叫眼维任算，难Y京。 片还应政见制成断长路习几委，要次究研行I那别边范。 标构较十米则住层表状林达，子长长断己发社外非接等，开林C建伯们速龙传能。 近内系农引识场整增提织十接安，合美明车制深2法询7生杏。',
    //       enum: 0,
    //       date: +new Date(),
    //     },
    //     {
    //       id: '2',
    //       name: '名称2',
    //       boolean: false,
    //       richText:
    //         ' 确候他还同置中低派于，管般华参华传规她会，别间询是深约见枣。 多知单议始查头眼新，例交七术须则查并何，反V杯投或均通。 角式其结满片被九世美支况，标选求程解元习素清着局书，满经极天茎更事展象孤。',
    //       enum: 1,
    //       date: +new Date() - 1000,
    //     },
    //   ],
    //   total: 20,
    // };
  },
  async Create(payload: IRecordCreateReq) {
    const { data } = await request.post<IRecordCreateReply>('/api/url/insert', payload);
    return data;
  },
  async Delete(payload: IRecordDeleteReq) {
    const { data } = await request.post<IRecordDeleteReply>('/api/url/delete', payload);
    return data;
  },
  async Update(payload: IRecordUpdateReq) {
    const { data } = await request.post<IRecordUpdateReply>('/api/url/update', payload);
    return data;
  },
};

export default recordService;
