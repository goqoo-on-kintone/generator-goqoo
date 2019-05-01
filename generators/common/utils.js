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
 * kintone API へのリクエストメソッドをラップして以下の挙動を追加する
 * - 通信が正常でも kintone の論理エラーだったケースは reject する
 * @function apiCaller
 * @return {function} ラップした関数
 */
const kintoneApiCaller = api => {
  return data => {
    return api(data)
      .then(response => {
        if (response.message && response.id && response.code) {
          throw new Error(`Message: ${response.message}`)
        } else {
          return response
        }
      })
      .catch(error => {
        throw new Error(error)
      })
  }
}

module.exports = {
  getAppName,
  kintoneApiCaller,
}
