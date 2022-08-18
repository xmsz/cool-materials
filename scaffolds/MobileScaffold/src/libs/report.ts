import { APP_MODE } from 'rax-app';
import { isWeb, isWeChatMiniProgram } from 'universal-env';

class Report {
  private isWeChatMiniProgram = isWeChatMiniProgram;

  event(name: string, data: Record<string, any>) {
    const dataKeys = Object.keys(data);

    if (this.isWeChatMiniProgram) {
      // wx.reportAnalytics(name, data);
      // @ts-ignore type
      wx.reportEvent(name, data);
    } else if (isWeb) {
      if (APP_MODE === 'start') return;
      dataKeys.forEach((key) => {
        // @ts-ignore type
        window._hmt.push(['_trackEvent', name, key, data[key], 0]);
      });
    }
  }
}

export default new Report();
