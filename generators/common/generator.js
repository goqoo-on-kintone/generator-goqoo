'use strict'
const Generator = require('yeoman-generator')
const EnvironmentLogger = require('yeoman-environment/lib/util/log')

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options)

    this.log = EnvironmentLogger({
      colors: {
        run: 'green',
      },
    })
  }
}
