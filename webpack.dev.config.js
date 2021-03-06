var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin  = require('html-webpack-plugin');
var ENV = process.env.ENV = process.env.NODE_ENV = 'development';

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: [
    'whatwg-fetch',
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/only-dev-server',
    'babel-polyfill',
    './index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'NODE_ENV': JSON.stringify(ENV)
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'react-hot',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0', 'react'],
          'env': {
            'development': {
              'presets': ['react-hmre'],
            },
          },
        },
      },
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.scss$/,
        loaders: [ 'style-loader', 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'file-loader'
      },
    ],
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      ie: 'component-ie',
    },
  },
};
