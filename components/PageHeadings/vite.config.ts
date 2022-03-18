/* eslint-disable @iceworks/best-practices/no-http-url */
import Unocss from 'unocss/vite';
import { presetUno, presetIcons } from 'unocss';
import { defineConfig } from 'vite';
import transformerDirective from '@unocss/transformer-directives';
import path from 'path';

export default defineConfig({
  define: {
    VITE: true,
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'vite.ts'),
      name: 'index',
      formats: ['es'],
    },
    outDir: 'lib',
    emptyOutDir: false,
    rollupOptions: {
      external: ['react', '@alifd/next'],
    },
  },

  plugins: [
    Unocss({
      presets: [presetUno(), presetIcons()],
      transformers: [transformerDirective()],
    }),
  ],
});
