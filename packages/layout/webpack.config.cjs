const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  entry: './src/index.jsx',
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 5175,
  },
  output: {
    publicPath: 'auto',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            '@babel/preset-env',
            ['@babel/preset-react', { runtime: 'automatic' }],
            '@babel/preset-typescript',
          ],
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'layout',
      filename: 'remoteEntry.js',
      exposes: {
        './setTitle': './src/setTitle.ts',
        './Layout': './src/Layout.tsx',
        './Header': './src/Header.tsx',
        './Footer': './src/Footer.tsx',
        './Sidebar': './src/Sidebar.tsx'
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '^19.2.0' },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: '^19.2.0',
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  target: 'web',
};
