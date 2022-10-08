import { Body, Controller, Headers, Inject, Post } from '@midwayjs/decorator';
import { IAuthLoginReply, IAuthLoginReq } from '../interface';
import { JwtService } from '@midwayjs/jwt';

@Controller('/api/auth')
export class AuthController {
  @Inject()
  jwtService: JwtService;

  @Post('/auth/login')
  async Login(
    @Body() body: IAuthLoginReq,
    @Headers()
    headers: {
      referer: 'https://servicewechat.com/wx689b97e76625d002/devtools/page-frame.html';
    }
  ): Promise<IAuthLoginReply> {
    const { code } = body;
    const { referer } = headers;
    const appId = referer
      .match(/\/wx.+?\//i)
      .toString()
      .replace(/\//gi, '');

    const res = await this.jwtService.sign({
      appId,
      openId: code,
    });

    return {
      token: res,
    };
  }
}
