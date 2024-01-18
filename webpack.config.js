const path = require('path');

module.exports = {
  entry: './src/BouncingCircles/index.tsx',  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'umd',
    library: 'TBouncingCircle',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@babel/preset-env': require.resolve('@babel/preset-env'),
    },
  },
};