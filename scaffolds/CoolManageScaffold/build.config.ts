import Unocss from 'unocss/vite';
import { presetUno } from 'unocss';

export default {
  vite: true,
  hash: true,
  vitePlugins: [
    Unocss({
      presets: [presetUno()],
    }),
  ],
  // proxy: {
  //   '/api': {
  //     target: 'http://127.0.0.1:7001',
  //   },
  // },
};
