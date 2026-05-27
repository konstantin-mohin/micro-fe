const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devServer: {
    allowedHosts: 'all',
    compress: false, // MANDATORY for SSE: prevents buffering/compression
    static: [
      {
        directory: path.join(__dirname, 'dist'),
        publicPath: '/',
      },
      {
        directory: path.resolve(__dirname, '../ui/storybook-static'),
        publicPath: '/design-system',
        serveIndex: true,
      },
    ],
    port: 3000,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        xfwd: true,
      },
    },
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
      name: 'host_app',
      remotes: {
        'microfrontend_one': `promise new Promise(resolve => {
          const manifestUrl = window.APP_MANIFEST?.microfrontend_one;
          const url = (!manifestUrl || manifestUrl.includes('\${')) ? 'http://localhost:5174' : manifestUrl;
          const script = document.createElement('script');
          script.src = \`\${url.replace(/\\/$/, '')}/remoteEntry.js\`;
          script.onload = () => {
            const proxy = {
              get: (request) => window.microfrontend_one.get(request),
              init: (arg) => {
                try {
                  return window.microfrontend_one.init(arg);
                } catch(e) {
                  console.log('remote container already initialized');
                }
              }
            };
            resolve(proxy);
          };
          script.onerror = () => {
            console.error('Failed to load microfrontend_one');
            resolve(null);
          };
          document.head.appendChild(script);
        })`,
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '^19.2.0' },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: '^19.2.0',
        },
        'react-router-dom': {
          singleton: true,
          eager: true,
          requiredVersion: '^7.13.0',
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
