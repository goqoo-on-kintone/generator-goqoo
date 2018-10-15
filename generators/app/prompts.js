'use strict'
const utils = require('../common/utils')

module.exports = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Please choose your project name',
    default: utils.getAppName(),
  },
]
