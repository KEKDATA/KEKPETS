const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  core: {
    builder: 'webpack5',
  },
  webpackFinal: async (config, { configType }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      requests: path.resolve(__dirname, '../src/requests'),
      entity: path.resolve(__dirname, '../src/entity'),
      constants: path.resolve(__dirname, '../src/constants'),
      features: path.resolve(__dirname, '../src/features'),
      shared: path.resolve(__dirname, '../src/shared'),
      models: path.resolve(__dirname, '../src/models'),
      pages: path.resolve(__dirname, '../src/pages'),
      typings: path.resolve(__dirname, '../src/typings'),
      assets: path.resolve(__dirname, '../src/assets'),
    };

    return config;
  },
};
