/* eslint-disable no-console */
const webpack = require('webpack')
const path = require('path')
const rcfile = require('rc-config-loader')
require('dotenv').config({ path: path.resolve('config/.env') })
const DropboxKintone = require('./.goqoo/dropbox')
const S3Plugin = require('webpack-s3-plugin')

const { npm_package_name: projectName } = process.env
const { apps, useDropbox } = rcfile('goqoo', { configFileName: `${__dirname}/config/goqoo.config` }).config

const entry = apps.reduce((obj, file) => {
  obj[file] = ['babel-polyfill', `${__dirname}/apps/${file}/${file}`]
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
    const dbxOutputPaths = apps.map(file => `/${outputDir}/${file}.js`)
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
        loader: ['style-loader/useable', 'css-loader'],
      },
      {
        test: /\.scss$/,
        loader: ['style-loader/useable', 'css-loader', 'sass-loader'],
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
    contentBase: path.resolve(__dirname, './dist'),
    inline: true,
    // hot: true,
    https: true,
    port: 8888,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
}

if (process.env.S3) {
  config.entry = Object.entries(config.entry).reduce((obj, [key, value]) => {
    obj[`${key}-${process.env.AWS_RANDOM_SUFFIX}`] = value
    return obj
  }, {})

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
      basePath: projectName,
    })
  )
}

module.exports = config
