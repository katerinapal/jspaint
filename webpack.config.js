var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
	  index : './index.js'
  },
  output: {
      publicPath: '/',
	  path: path.join(__dirname, 'output'),
	  filename: '[name].js'
  },
  debug: true,
  devtool: 'source-map',
  module: {
    loaders: [
      { 
        test: /\.js$/,
        include: path.join(__dirname, '/'),
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      { 
        test: /\.less$/,
        loader: "style!css!autoprefixer!less"
      },
    ]
  },
  devServer: {
    contentBase: "./",
	outputPath: path.join(__dirname, 'output')
  },
};