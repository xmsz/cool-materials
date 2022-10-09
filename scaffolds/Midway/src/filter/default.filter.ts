import { MidwayHttpError } from '@midwayjs/core';
import { Catch } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';

@Catch()
export class DefaultErrorFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    let axiosError = err['response']?.['data'];

    if (!err.status) {
      console.log(axiosError || err);
    }

    let message = axiosError?.message || err.message;

    ctx.status = err.status || 500;

    // 所有的未分类错误会到这里
    return {
      success: false,
      message,
    };
  }
}
