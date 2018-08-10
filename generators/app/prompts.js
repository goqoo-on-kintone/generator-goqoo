'use strict'
const utils = require('../../utils/all')

module.exports = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Please choose your project name',
    default: utils.yeoman.getAppName(),
  },
]
