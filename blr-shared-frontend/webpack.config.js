const path = require('path');

module.exports = {
  entry: './src/index.js',
  
  mode: 'production',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      type: 'umd',
      name: 'BlrSharedFrontend'
    },
    globalObject: 'this'
  },
  
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  
  externals: {
    'jquery': {
      commonjs: 'jquery',
      commonjs2: 'jquery',
      amd: 'jquery',
      root: '$'
    },
    'bootstrap': {
      commonjs: 'bootstrap',
      commonjs2: 'bootstrap',
      amd: 'bootstrap',
      root: 'bootstrap'
    }
  }
};
