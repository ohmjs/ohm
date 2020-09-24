'use strict';

const path = require('path');
const webpack = require('webpack');

const {version} = require('./package.json');

module.exports = function(env, argv) {
  return {
    entry: './src/main.js',
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'extras')
          ],
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    output: {
      library: 'ohm',
      libraryTarget: 'umd',
      filename: argv.mode === 'development' ? 'ohm.js': 'ohm.min.js',
      path: path.resolve(__dirname, 'dist')
    },
    devtool: argv.mode === 'development' ? 'inline-source-map' : false,
    plugins: [
      new webpack.DefinePlugin({
        __GLOBAL_OHM_VERSION__: JSON.stringify(version)
      }),
      // Prevent package.json from being included in the bundle -- it is required from version.js,
      // but it is only used when `__GLOBAL_OHM_VERSION__` (see above) is not defined.
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\.\/package\.json$/
      })
    ]
  };
};
