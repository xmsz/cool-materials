// MPA 模式下该文件无效
import { runApp, IAppConfig } from 'rax-app';
import dayjs from 'dayjs';

require('dayjs/locale/zh-cn');

dayjs.locale('zh-cn');

const appConfig: IAppConfig = {};
runApp(appConfig);
