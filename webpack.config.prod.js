const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production'),
  __DEV__: false
};

module.exports = {
  devtool: 'none',
  entry: path.resolve(__dirname, 'src/index'),
  target: 'web',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'sortviewer.[hash].js'
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: true
    }),
    new webpack.optimize.UglifyJsPlugin({ uglifyOptions: { ecma: 8 } }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      noInfo: true,
      options: {
        context: '/',
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        enforce: 'pre',
        use: ['babel-loader']
      },
      {test: /(\.css)$/, loaders: ['style-loader', 'css-loader']},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader'},
      {test: /\.(woff|woff2)$/, loader: 'file-loader'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader'}
    ]
  }
};
