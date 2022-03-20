/* eslint-disable @iceworks/best-practices/no-http-url */
import Unocss from 'unocss/vite';
import { presetUno, presetIcons } from 'unocss';
import transformerDirective from '@unocss/transformer-directives';

export default {
  publicPath: '',
  vite: true,
  vitePlugins: [
    Unocss({
      presets: [presetUno(), presetIcons()],
      transformers: [transformerDirective()],
    }),
  ],
  proxy: {
    '/api': {
      enable: true,
      //       target: 'http://127.0.0.1:7001',
      target: 'https://short-url.cpshelp.cn',
    },
  },
};
