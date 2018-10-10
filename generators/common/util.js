'use strict'
const chalk = require('chalk')

const padding = str => ('         ' + str).substr(-9) + ' '
const coloredMessage = (color, fileStatus, relativePath) => chalk[color](padding(fileStatus)) + relativePath
const message = {
  error: m => coloredMessage('red', 'Error', m),
  force: m => coloredMessage('yellow', 'force', m),
}

module.exports = { message }
