const rem2rpx = require('postcss-rem-to-responsive-pixel/postcss7');
const tailwindcss = require('tailwindcss');
const { RaxTailwindcssWebpackPluginV5 } = require('weapp-tailwindcss-webpack-plugin');

const checkPostcssLoader = (config, ruleName) =>
  config.module.rules.has(ruleName) && config.module.rule(ruleName).uses.has('postcss-loader');

module.exports = ({ onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    const rules = ['css', 'css-module', 'css-global', 'scss', 'scss-module', 'scss-global'];

    rules.forEach((rule) => {
      if (checkPostcssLoader(config, rule)) {
        config.module
          .rule(rule)
          .use('postcss-loader')
          .tap((options) => ({
            ...options,
            postcssOptions: {
              ...options.postcssOptions,
              plugins: [
                tailwindcss,
                rem2rpx({ rootValue: 4.267, propList: ['*'], transformUnit: 'vw' }),
                ...options.postcssOptions.plugins,
              ],
            },
          }));
      }
    });
  });

  onGetWebpackConfig('wechat-miniprogram', (config) => {
    config.plugin('RaxTailwindcssWebpackPluginV5').use(RaxTailwindcssWebpackPluginV5);
  });
};
