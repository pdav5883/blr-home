const path = require('path');
const HtmlWebpack = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.js',
    login: './src/login.js'
  },
  
  mode: 'production',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js', // Use [name] placeholder for multiple entries
    library: {
      type: 'umd',
      name: '[name]' // Use [name] placeholder for library names
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

  plugins: [
    new HtmlWebpack({
      title: 'Login',
      filename: 'login.html',
      template: './src/login.html',
      chunks: ['login'],
      inject: true
    })
  ],
  
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