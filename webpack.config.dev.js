
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    path.resolve(__dirname, 'src/index')
  ],
  target: 'web',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'sortviewer.[hash].js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'src'),

  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({ template: 'src/index.html' })
  ],
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader']},
      {test: /(\.css)$/, loaders: ['style-loader', 'css-loader']},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader?name=./fonts/[hash].[ext]'},
      {test: /\.(woff|woff2)$/, loader: 'file-loader?name=./fonts/[hash].[ext]'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader?name=./fonts/[hash].[ext]'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader?name=./fonts/[hash].[ext]'}
    ]
  }
};
