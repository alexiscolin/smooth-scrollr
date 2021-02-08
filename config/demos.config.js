const path = require('path');
const merge = require('webpack-merge');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: 'eval-source-map',

  entry: {
     demos: path.resolve(__dirname, '../demos/src/script.js')
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },

  devServer: {
    compress: true,
    open: true,
    stats: "errors-only",
    port: 9900
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname,"../demos/vertical.html"),
      filename: "index.html"
    })
  ]
}