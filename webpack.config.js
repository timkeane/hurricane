const nodeEnv = process.env.NODE_ENV
require('dotenv').config()
const version = require('./package.json').version
const path = require('path')
const replace = require('nyc-build-helper').replace

console.log(`NODE_ENV=${process.env.NODE_ENV}`)
console.log(`version=${version}`)

const isPrd = ['production', 'prod', 'prd'].indexOf(nodeEnv) > -1
const isStg = ['stg', 'staging'].indexOf(nodeEnv) > -1
const webpack = require('webpack')
const Minify = require('babel-minify-webpack-plugin')
const Clean = require('clean-webpack-plugin')
const Copy = require('copy-webpack-plugin')

const replaceOptions = [
  {
    dir: 'dist',
    files: ['index.html'],
    rules: [{
      search: /%ver%/g,
      replace: version
    }]
  }, 
  {
    dir: 'dist/js',
    files: ['hurricane.js'],
    rules: [{
      search: 'app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example',
      replace: process.env.GEOCLIENT_KEY
    }]
  },
  {
    dir: 'dist/js',
    files: ['hurricane.js'],
    rules: [{
      search: 'https://maps.googleapis.com/maps/api/js?&channel=pka&sensor=false&libraries=visualization',
      replace: process.env.GOOGLE_DIRECTIONS
    }]
  }
]

if (isPrd) {
  replaceOptions.push({
    dir: 'dist',
    files: ['index.html'],
      rules: [{
      search: '/* google analytics */',
      replace: process.env.GOOGLE_ANALYTICS
    }]
  })
}

const plugins = [
  new Clean(['dist']),
  new webpack.optimize.ModuleConcatenationPlugin(),
  new Copy([
    './src/index.html',
    './src/manifest.webmanifest',
    {from: './src/img', to: 'img'},
    {from: './src/data', to: 'data'},
    {
      from: './node_modules/nyc-lib/css/build/nyc.ol.hurricane.theme.css',
      to: 'css/hurricane.css',
      type: 'dir'
    }
  ]),
  replace.replacePlugin(replaceOptions)
]

plugins.push(new Minify())

module.exports = {
  entry: path.resolve(__dirname, 'src/js/index.js'),
  output: {
     path: path.resolve(__dirname, 'dist'),
     filename: 'js/hurricane.js'
  },
  devtool: (isStg || isPrd) ? false : 'cheap-module-eval-source-map',
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }]
  },
  externals: {
    jquery: 'jQuery',
    'text-encoding': 'window',
    leaflet: 'L',
    shapefile: '(window.shapefile || {})',
    papaparse: '(window.Papa || {})',
    proj4: '(window.proj4 || {defs: function(){}})'
  },
  plugins: plugins
}
