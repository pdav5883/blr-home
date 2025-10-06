const path = require('path')
const HtmlWebpack = require('html-webpack-plugin')
const CopyWebpack = require('copy-webpack-plugin')
const { execSync } = require('child_process')

// Get CloudFormation parameters
const cfParams = Object.fromEntries(
  execSync('bash get-cf-params.sh', { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map(line => {
      const [key, value] = line.split('=')
      return [key, JSON.stringify(value.trim())]
    })
)

module.exports = {
  entry: {
    navonly: {
      import: './src/scripts/navonly.js'
    },
    login: {
      import: require.resolve('blr-shared-frontend/dist/login.js'),
    },
  },
  
  mode: 'development',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'scripts/[name].bundle.js'
  },
  
  plugins: [
    new HtmlWebpack({
      title: 'Bear Loves Rocks',
      favicon: './src/images/favicon.ico',
      filename: 'index.html',
      template: './src/index.html',
      chunks: ['navonly']
    }),
    new HtmlWebpack({
      title: "Login",
      filename: "login.html",
      template: require.resolve('blr-shared-frontend/src/login.html'),
      chunks: ["navonly", "login"],
      inject: true
    }),
    new HtmlWebpack({
      title: 'BLR Name',
      favicon: './src/images/favicon.ico',
      filename: 'name.html',
      template: './src/name.html',
      chunks: ['navonly']
    }),
    new HtmlWebpack({
      title: 'BLR Author',
      favicon: './src/images/favicon.ico',
      filename: 'author.html',
      template: './src/author.html',
      chunks: ['navonly']
    }),
    new HtmlWebpack({
      title: 'BLR Projects',
      favicon: './src/images/favicon.ico',
      filename: 'projects.html',
      template: './src/projects.html',
      chunks: ['navonly']
    }),
    new HtmlWebpack({
      title: 'BLR Blog',
      favicon: './src/images/favicon.ico',
      filename: 'blog.html',
      template: './src/blog.html',
      chunks: ['navonly']
    }),
    new HtmlWebpack({
      title: 'BLR WIP',
      favicon: './src/images/favicon.ico',
      filename: 'wip.html',
      template: './src/wip.html',
      chunks: ['navonly']
    }),
    new CopyWebpack({
      patterns: [
        {
          from: './src/images',
          to: 'assets'
        },
        {
          from: require.resolve('blr-shared-frontend/dist/login.js'),
          to: 'scripts/login.bundle.js'
        }
      ]
    })
  ],
  
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        use: [{
          loader: 'string-replace-loader',
          options: {
            multiple: Object.entries(cfParams).map(([key, value]) => ({
              search: key,
              replace: value,
              flags: 'g'
            }))
          }
        }]
      }
    ]
  }
}
