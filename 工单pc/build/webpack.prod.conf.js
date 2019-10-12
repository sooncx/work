'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const prodWebpackConfig = merge(baseWebpackConfig, {
  devtool: '#source-map',
  plugins: [
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      },
      cssProcessor: require('cssnano'),
      canPrint: false
    }),
    new webpack.DefinePlugin({
      IS_DEV: JSON.stringify(false)
    })
  ],
})

module.exports = prodWebpackConfig