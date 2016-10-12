'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './components/main.js',
  output: {
    path: path.resolve(__dirname, './components'),
    filename: 'bundle.js'
  },
  resolve: {
    // See https://github.com/vuejs/vue-loader/issues/287.
    // TODO: Remove this when everything is in .vue files.
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  resolveLoader: {
    root: path.join(__dirname, '..', 'node_modules')
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: '#eval-source-map',
  debug: true
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';

  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]);
}
