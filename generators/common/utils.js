'use strict'

const path = require('path')
const _ = require('underscore.string')

/**
 * Get the base directory
 * @return {String}
 */
const getBaseDir = () => {
  return path.basename(process.cwd())
}

/**
 * Get a js friendly application name
 * @param  {String} appName The input application name [optional]
 * @return {String}
 */
const getAppName = appName => {
  // If appName is not given, use the current directory
  if (appName === undefined) {
    appName = getBaseDir()
  }

  return _.slugify(_.humanize(appName))
}

/**
 * kintone API へのリクエストに渡すコールバックをラップして、
 * 通信が正常でも kintone の論理エラーだったケースをエラーとして扱うコールバック関数を返す
 * @callback callback
 * @return {function} コールバック関数
 */
const kintonizeCallback = callback => {
  return (err, response) => {
    let error = err
    if (response.message && response.id && response.code) {
      error = response.message
    }
    callback(error, response)
  }
}

module.exports = {
  getAppName,
  kintonizeCallback,
}
