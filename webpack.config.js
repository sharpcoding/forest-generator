/***
 * This config file is being keps as simple as possible.
 * Dedicated for newest webpack v2, react documentation online 
 * https://webpack.js.org/configuration/
 */

const path = require('path');
const webpack = require('webpack');

const config = {
  entry: "./src/main.tsx",
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/dist/",
    filename: 'bundle.js'
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "dist")
    ],
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [{
        test: /\.(ts|tsx)(\?.*)?$/,
        loaders: ['ts-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  }
};

module.exports = config;