'use strict'

const {
  join,
  resolve
} = require('path')
const webpack = require('webpack')
const glob = require('glob')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const extractCSS = new ExtractTextPlugin({
  filename: 'assetsVue/css/[name].css',
  allChunks: true
})
const extractLESS = new ExtractTextPlugin({
  filename: 'assetsVue/css/[name].css',
  allChunks: true
})

const entries = {}
const chunks = []
const htmlWebpackPluginArray = []
glob.sync('./src/pages/**/app.js').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/app.js')[0]
  entries[chunk] = path
  chunks.push(chunk)

  const filename = chunk + '.html'
  const htmlConf = {
    filename: filename,
    template: path.replace(/.js/g, '.html'),
    inject: 'body',
    // favicon: './src/assets/img/logo.png',
    hash: true,
    chunks: ['commons', chunk, ]
  }
  htmlWebpackPluginArray.push(new HtmlWebpackPlugin(htmlConf))
})

const styleLoaderOptions = {
  loader: 'style-loader',
  options: {
    sourceMap: true
  }
}
const cssOptions = [{
    loader: 'css-loader',
    options: {
      importLoader: 1,
      sourceMap: true
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: true
    }
  },
]
const lessOptions = [...cssOptions, {
  loader: 'less-loader',
  options: {
    sourceMap: true
  }
}]
const config = {
  entry: Object.assign({}, entries, {
    // server: '../staticVue/server.js',
  }),
  output: {
    path: resolve(__dirname, '../dist'),
    filename: 'assetsVue/js/[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      assets: join(__dirname, '../src/assets'),
      components: join(__dirname, '../src/components'),
      'vue': 'vue/dist/vue.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
              use: cssOptions,
              fallback: styleLoaderOptions
            })),
            less: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
              use: lessOptions,
              fallback: styleLoaderOptions
            })),
            postcss: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
              use: cssOptions,
              fallback: styleLoaderOptions
            }))
          }
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          use: cssOptions,
          fallback: styleLoaderOptions
        }))
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'less-loader'
          }],
          fallback: styleLoaderOptions
        })
        // use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
        //   use: lessOptions,
        //   fallback: styleLoaderOptions
        // }))

      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            root: resolve(__dirname, 'src'),
            attrs: ['img:src', 'link:href']
          }
        }]
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        exclude: /favicon\.png$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'assetsVue/img/[name].[hash:7].[ext]'
          }
        }]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 3,
          name: 'commons',
          enforce: true
        }
      }
    }
  },
  performance: {
    hints: false
  },
  externals: {
    'vue': 'Vue',
    "element-ui": "ELEMENT",
    "vue-router": "VueRouter",
    "vuex": "Vuex",
    "qs": "qs",
    "axios": "axios",
    "jquery": "$",
  },
  // 这里需要将vue和vue-router公开出去，供全局使用，这里小写的(即冒号左边的)vue和vue-router是我们引入资源时对应的名字，冒号右面的是由库的主人暴露出来的全局方法名
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    extractLESS,
    extractCSS
  ]
}
config.plugins = [...config.plugins, ...htmlWebpackPluginArray]
module.exports = config