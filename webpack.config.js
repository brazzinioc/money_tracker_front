const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/assets/js'),
  },
  plugins: [
    new Dotenv(),
  ],
  watch: false,
};