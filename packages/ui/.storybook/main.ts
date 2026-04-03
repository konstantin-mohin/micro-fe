import type { StorybookConfig } from '@storybook/react-webpack5';
import { dirname } from "path"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}
const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    getAbsolutePath('@storybook/addon-webpack5-compiler-swc'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs')
  ],
  "framework": {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {}
  },
  webpackFinal: async (config) => {
    // Remove any existing CSS rules
    if (config.module?.rules) {
      config.module.rules = config.module.rules.filter(rule => {
        if (!rule || typeof rule !== 'object' || Array.isArray(rule)) return true;
        const test = (rule as { test?: any }).test;
        if (!test) return true;
        
        // Robust check for CSS-related rules
        return !(/\.css$/.test(test.toString()) || test.toString().includes('css'));
      });

      // Add our custom CSS rule that matches your UI package's webpack config
      config.module.rules.push({
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
        include: path.resolve(__dirname, '../'),
      });
    }
    return config;
  },
};
export default config;