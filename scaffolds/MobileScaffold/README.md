```
pnpm create rax
pnpm i --shamefully-hoist
pnpm i dayjs ahooks axios @alifd/meet @uni/intersection-observer @uni/toast @uni/loading axios-miniprogram-adapter
pnpm i build-plugin-rax-compat-react build-plugin-fusion-mobile tailwindcss postcss-rem-to-responsive-pixel weapp-tailwindcss-webpack-plugin  -D
cp build.plugin.js tailwind.config.js NavigationBar libs interface models store
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
