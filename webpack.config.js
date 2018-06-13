
const nodeEnv = process.env.NODE_ENV
const version = require('./package.json').version
const path = require('path')

console.warn(`NODE_ENV=${process.env.NODE_ENV}`)
console.warn(`version=${version}`)

const isProd = ['production', 'prod', 'prd'].indexOf(nodeEnv) > -1
const webpack = require('webpack')
const Minify = require('babel-minify-webpack-plugin')
const Clean = require('clean-webpack-plugin')
const Copy = require('copy-webpack-plugin')
const Replace = require('replace-in-file-webpack-plugin')

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
  new Replace([{
      dir: 'dist',
      files: ['index.html'],
      rules: [{
          search: /%ver%/g,
          replace: version
      }]
  }])
]

if (isProd) {
  plugins.push(new Minify())
}

module.exports = {
  entry: path.resolve(__dirname, 'src/js/index.js'),
  output: {
     path: path.resolve(__dirname, 'dist'),
     filename: 'js/hurricane.js'
  },
  devtool: isProd ? false : 'cheap-module-eval-source-map',
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
    
    // 'ol/extent': 'ol.extent',
    // 'ol/coordinate': 'ol.coordinate',
    // 'ol/tilegrid': 'ol.tilegrid',
    // 'ol/feature': 'ol.Feature',
    // 'ol/map': 'ol.Map',
    // 'ol/view': 'ol.View',
    // 'ol/overlay': 'ol.Overlay',
    // 'ol/geolocation': 'ol.Geolocation',
    // 'ol/format/feature': 'ol.format.Feature',
    // 'ol/format/geojson': 'ol.format.GeoJSON',
    // 'ol/format/formattype': 'ol.format.FormatType',
    // 'ol/source/vector': 'ol.source.Vector',
    // 'ol/source/xyz': 'ol.source.XYZ',
    // 'ol/layer/vector': 'ol.layer.Vector',
    // 'ol/layer/tile': 'ol.layer.Tile',
    // 'ol/style/style': 'ol.style.Style',
    // 'ol/style/icon': 'ol.style.Icon',
    // 'ol/geom/point': 'ol.geom.Point',
    // 'ol/geom/linestring': 'ol.geom.LineString',
    // 'ol/geom/polygon': 'ol.geom.Polygon',
    // 'ol/proj/projection': 'ol.proj.Projection',

    'text-encoding': 'window',
    leaflet: 'L',
    shapefile: '(window.shapefile || {})',
    papaparse: '(window.Papa || {})',
    proj4: '(window.proj4 || {defs: function(){}})'
  },
  plugins: plugins
}
