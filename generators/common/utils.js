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
 * - Promise を返す
 * - 通信が正常でも kintone の論理エラーだったケースを reject する
 * @function apiCaller
 * @return {function} ラップした関数
 */
const promisifyKintoneApiCaller = apiCaller => {
  return data => {
    return new Promise((resolve, reject) => {
      apiCaller(data, (err, response) => {
        let error = err
        if (!error && (response.message && response.id && response.code)) {
          error = response.message
        }
        if (error) {
          reject(error)
        } else {
          resolve(response)
        }
      })
    })
  }
}

module.exports = {
  getAppName,
  promisifyKintoneApiCaller,
}
