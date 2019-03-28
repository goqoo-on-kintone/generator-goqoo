/* eslint-disable no-console */
const webpack = require('webpack')
const path = require('path')
const rcfile = require('rc-config-loader')
require('dotenv').config()
const DropboxKintone = require('./dropbox')
const S3Plugin = require('webpack-s3-plugin')

const { npm_package_name: projectName } = process.env
const { apps, useDropbox } = rcfile('goqoo', { configFileName: path.resolve('config', 'goqoo.config') }).config

const entry = apps.reduce((obj, appName) => {
  obj[appName] = ['babel-polyfill', path.resolve('apps', appName)]
  return obj
}, {})

const output = { path: path.resolve('dist') }
if (useDropbox) {
  const dropbox = {
    rootDir: process.env.DROPBOX_ROOT,
    subDir: process.env.DROPBOX_KINTONE_DIR,
    token: process.env.DROPBOX_TOKEN,
  }

  if (!dropbox || !dropbox.rootDir) {
    console.error('DROPBOX_ROOT: environment variable not found!')
    process.exit(1)
  }

  const outputDir = `${dropbox.subDir || ''}/${projectName}`
  output.path = path.resolve(path.join(dropbox.rootDir, outputDir))

  if (dropbox.token) {
    const dbxKintone = new DropboxKintone({
      accessToken: dropbox.token,
      localRootDir: dropbox.rootDir,
    })
    const dbxOutputPaths = apps.map(appName => `/${outputDir}/${appName}.js`)
    dbxKintone.fetchSharedLinks(dbxOutputPaths).then(paths => {
      console.log(JSON.stringify(paths, null, '  '))
    })
  }
}

const config = {
  entry,
  output,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { browsers: ['last 2 versions'] },
                modules: false,
              },
            ],
          ],
          plugins: [['@babel/proposal-class-properties', { loose: false }]],
        },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [require('autoprefixer')]
              },
            },
          },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: path.resolve('dist'),
    inline: true,
    // hot: true,
    https: true,
    port: 59000,
    headers: { 'Access-Control-Allow-Origin': '*' },
    disableHostCheck: true,
    progress: true,
  },
}

if (process.env.S3) {
  config.entry = Object.entries(config.entry).reduce((obj, [key, value]) => {
    obj[`${key}-${process.env.AWS_RANDOM_SUFFIX}`] = value
    return obj
  }, {})
  ;['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_S3_REGION', 'AWS_S3_BUCKET'].forEach(variable => {
    if (!process.env[variable]) {
      console.error(`${variable}: environment variable not found!`)
      process.exit(1)
    }
  })

  config.plugins.push(
    new S3Plugin({
      // Exclude uploading of html
      exclude: /.*\.html$/,
      // s3Options are required
      s3Options: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_S3_REGION,
      },
      s3UploadOptions: {
        Bucket: process.env.AWS_S3_BUCKET,
      },
      basePath: process.env.AWS_S3_BASEPATH || projectName,
    })
  )
}

module.exports = config
