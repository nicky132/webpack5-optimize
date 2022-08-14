const webpack = require('webpack')
const { merge } = require('webpack-merge');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const common = require('./webpack.common')

const smp = new SpeedMeasurePlugin();

const isNeedSpeed = true

const config = merge(common, {
  // 模式
  mode: 'development',
  // 开发工具，开启 source map，编译调试
  devtool: 'eval-cheap-module-source-map',
  // 开发模式，自动更新改动
  devServer: {
    contentBase: './dist',
    port:8082,
    hot: true, // 热更新
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // 仅在分析构建速度时打开 SpeedMeasurePlugin 插件，这里我们先关闭 SpeedMeasurePlugin 的使用，来查看热更新效果。
    // new ReactRefreshWebpackPlugin(),
  ],
})

module.exports = isNeedSpeed ? smp.wrap(config) : config
