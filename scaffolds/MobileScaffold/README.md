```
pnpm create rax
pnpm i --shamefully-hoist
pnpm i dayjs ahooks axios @alifd/meet @uni/intersection-observer @uni/toast @uni/loading axios-miniprogram-adapter @uni/storage
pnpm i build-plugin-rax-compat-react build-plugin-fusion-mobile tailwindcss postcss-rem-to-responsive-pixel weapp-tailwindcss-webpack-plugin @types/wechat-miniprogram  -D
cp build.plugin.js tailwind.config.js libs interface models store global.scss assets components app.tsx
```

start => dev
--port 3054

build.json

```
{
  "targets": ["web"],
  "webpack5": true,
  "hash": true,
  "plugins": ["./build.plugin.js", "build-plugin-rax-compat-react", "build-plugin-fusion-mobile"],
  "proxy": {
    "/api": {
      "enable": true,
      "target": "http://localhost:10054/"
    }
  }
}
```

app.ts

```
// MPA 模式下该文件无效
import { runApp, IAppConfig } from 'rax-app';

const appConfig: IAppConfig = {
    router:{
        type: 'browser',
    }
};
runApp(appConfig);
```
