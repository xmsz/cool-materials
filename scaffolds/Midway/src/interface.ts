export type IAuthLoginReq = {
  code: string;
};
export type IAuthLoginReply = {
  token: string;
};

export type ICronPlanListReq = {};
export type ICronPlanListReply = {
  list: CronPlan[];
  total: number;
};
export type ICronPlanDetailReq = Pick<Partial<CronPlan>, 'id'>;
export type ICronPlanDetailReply = CronPlan;
export type ICronPlanCreateReq = Omit<Partial<CronPlan>, 'id'>;
export type ICronPlanCreateReply = {};
export type ICronPlanUpdateReq = Pick<CronPlan, 'id'> & Omit<Partial<CronPlan>, 'id'>;
export type ICronPlanUpdateReply = {};
export type ICronPlanDeleteReq = Pick<CronPlan, 'id'>;
export type ICronPlanDeleteReply = {};
