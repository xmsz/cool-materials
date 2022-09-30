module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx,wxml}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // 100: '#33ed9c',
          // 200: '#0ddf84',
          // 300: '#00CE21',
          // 400: '#03be6d',
        },
      },
    },
  },
  corePlugins: {},
};
