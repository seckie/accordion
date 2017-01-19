'use strict';

module.exports = {
  output: {
    filename: 'accordion.js',
    library: 'accordion',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel'}
    ],
    resolve: {
      extensions: ['', '.js']
    }
  },
  externals: {
    lodash: {
      root: '_',
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash'
    }
  }
};
