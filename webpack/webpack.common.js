const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  entry: {
  
    photo3d: Path.resolve(__dirname, '../src/scripts/photo3d.js'),
    
  },
  output: {
    path: Path.join(__dirname, '../build'),
    filename: 'js/[name].js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    /*
    new CopyWebpackPlugin([
      { from: Path.resolve(__dirname, '../public'), to: 'public' }
    ]),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/home.html'),
      chunks: ['home'],
      filename: 'home.html'
    }),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/login.html'),
      chunks: ['login'],
      filename: 'login.html'
    }),
    */
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/photo3d.html'),
      chunks: [ 'photo3d'],
      filename: 'index.html'
    })
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src')
    },
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }
      },
      {
        test: /\.(frag|vert|gltf)$/i,
        use: 'raw-loader'
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        //IMAGE LOADER
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        loader:'file-loader'
      }
    ]
  }
};
