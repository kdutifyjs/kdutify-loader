var path = require('path')
var webpack = require('webpack')
const KduLoaderPlugin = require('kdu-loader/lib/plugin')
const KdutifyLoaderPlugin = require('kdutify-loader/lib/plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: 'source-map',
  mode: isProd ? 'production' : 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.kdu$/,
        loader: 'kdu-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.styl$/,
        loader: ['kdu-style-loader', 'css-loader', 'stylus-loader']
      }
    ]
  },
  resolve: {
    alias: {
      'kdu$': path.resolve(__dirname, './node_modules/kdu/dist/kdu.esm.js')
    },
    extensions: ['*', '.js', '.kdu', '.json']
  },
  plugins: [
    new KduLoaderPlugin(),
    new KdutifyLoaderPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    })
  ],
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  optimization: {
    concatenateModules: false
  }
}

if (isProd) {
  module.exports.devtool = '#source-map'
  // http://kdujs-loader.web.app/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ])
}
