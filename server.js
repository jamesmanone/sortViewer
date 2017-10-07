
const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.dev');


const app = express();
const compiler = webpack(webpackConfig);


if(process.env.NODE_ENV !== 'production') {
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
}


if(process.env.NODE_ENV !== 'production') {
  app.get('*', (req, res) => {
    const filename = path.join(compiler.outputPath,'index.html');
    compiler.outputFileSystem.readFile(filename, (e, file) => {
      res.set('Content-Type', 'text/html')
      res.send(file);
    });
  });
}

if(process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    const filename = path.join(__dirname, 'dist', 'index.html')
    res.sendFile(filename);
  });
}


app.listen(3000);
