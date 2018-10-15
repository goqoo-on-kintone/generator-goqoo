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

module.exports = {
  getAppName,
}
