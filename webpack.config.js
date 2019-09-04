var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
	  index : ['lib/jquery.min.js', 'lib/pep.js',
			   'lib/canvas.toBlob.js', 'lib/gif.js/gif.js', 'lib/palette.js',
			   'lib/FileSaver.js', 'lib/font-detective.js', 'src/helpers.js',
			   'src/storage.js', 'src/$Component.js', 'src/$Window.js',
			   'src/$ToolBox.js', 'src/$ColorBox.js', 'src/$FontBox.js',
			   'src/$Handles.js', 'src/OnCanvasObject.js', 'src/Selection.js',
			   'src/TextBox.js', 'src/image-manipulation.js', 'src/tool-options.js',
			   'src/tools.js', 'src/functions.js', 'src/manage-storage.js',
			   'src/help.js', 'src/menus.js', 'src/app.js', 'src/$menus.js',
			   'src/canvas-change.js', 'src/sessions.js', './index.js']
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