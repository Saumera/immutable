const path = require('path');
const BUILD_DIR = path.resolve(__dirname, 'build');
const ENTRY = path.resolve(__dirname, 'src');

module.exports = {
  entry: ENTRY + '/index.js',
  output: {
    path: BUILD_DIR,
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: [/node_modules/, /build/, /\.test\.js$/],
        loader: 'babel-loader',
      },
    ],
  },
};
