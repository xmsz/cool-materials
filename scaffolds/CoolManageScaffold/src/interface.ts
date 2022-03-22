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
export interface IRecordSearchReply {
  data: {
    total: number;
    list: IRecord[];
  };
}

export interface IGroup {
  id: number;
  name: string;
}
export interface IGroupSearchReply {
  data: {
    list: IGroup[];
  };
}

export interface IGroupCreateReq {
  name: string;
}

export interface IRecordCreateReq {
  link: string;
  groupId?: number;
  key?: string;
  remark?: string;
}
export interface IRecordCreateReply {
  data: IRecord;
}

export interface IRecordDeleteReq {
  id: number;
}
export interface IRecordDeleteReply {
  data: null;
}

export interface IRecordUpdateReq extends IRecordCreateReq {
  id: number;
}
export interface IRecordUpdateReply {
  data: IRecord;
}
