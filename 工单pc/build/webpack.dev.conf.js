'use strict'
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const webpack = require('webpack')
const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    host: 'localhost',
    port: 8010,
    historyApiFallback: false,
    noInfo: true,
    proxy: {
      '/apiAjax': {
        // target: 'http://39.108.197.42:8010/',
        //target: 'http://yun.car900.com',
        target: 'http://192.168.100.226:8083/',
        // target:"http://47.106.47.104:9001/",
        // target: 'http://192.168.130.182:8083',
        // target:'http://dkb.cneop.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/apiAjax': ''
        }
      },
      '/host7515': {
        target: 'http://120.76.69.92:7515',
        changeOrigin: true,
        pathRewrite: {
          '^/host7515': ''
        }
      },
      '/demo12': {
        target: "http://120.76.217.214:6404",
        changeOrigin: true,
        pathRewrite: {
          '^/demo12': ''
        }
      }
    },
    open: true,
    openPage: 'user/login.html'
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEV: JSON.stringify(true)
    })
  ]
})

module.exports = devWebpackConfig