export interface IRecord {
  id: number;
  link: string;
  key: string;
  shortLink: string;
  updateTime: number;
  createTime: number;
  groupId: number;
  remark: string;
}
export interface IRecordReply {
  data: {
    total: number;
    list: IRecord[];
  };
}
