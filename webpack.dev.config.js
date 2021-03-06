var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    bundle: [
      'webpack-hot-middleware/client',
      './src/client.dev.js'
    ]
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: '/node_modules/', loader: 'react-hot!babel' },
      { test: /\.js$/, exclude: '/node_modules/', loader: "eslint-loader"   }
    ]
  },
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', 'src']
  },
  output: {
    path: __dirname + '/static',
    publicPath: '/',
    filename: '[name].js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
        CONFIG: require(path.join(__dirname, 'config/environments/development.json'))
    })
  ]
};
