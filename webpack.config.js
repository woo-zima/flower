const HtmlWebpackPlugin = require('html-webpack-plugin');
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');
const path = require('path');
const { DefinePlugin } = require('webpack');
const { VueLoaderPlugin } = require('vue-loader/dist/index');
module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    clean: true, // /dist文件夹清理
  },
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  devServer: {
    //static: './dist', //从什么位置查找文件
    port: '3001',
    hot: true,
    historyApiFallback: true, //开启webpack中 devServer关于h5的history api 的配置
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/i,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new VueLoaderPlugin(),
    new DefinePlugin({
      BASE_URL: '"./"',
      __VUE_OPTIONS_API__: false, // 是否支持optionsApi
      __VUE_PROD_DEVTOOLS__: false, // 在生成环境是否支持devtools
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  devtool: 'inline-source-map',
};
