'use strict'
const Generator = require('./generator')
const fs = require('fs')
const yaml = require('js-yaml')

module.exports = class extends Generator {
  configuring() {
    this.appName = this.args[0]
  }

  writing() {
    const appName = this.appName

    // Define app name
    const configRelativePath = 'config/goqoo.config.yml'
    const config = yaml.safeLoad(this.fs.read(this.destinationPath(configRelativePath)))
    if (Object.values(config.apps).includes(appName)) {
      // TODO: Appという表記をどうするか・・
      this.log.error(`App '${appName}' already exists!`)
      this.env.error()
    }
    config.apps.push(appName)
    const configStr = yaml.safeDump(config)
    fs.writeFileSync(this.destinationPath(configRelativePath), configStr)
    this.log.force(configRelativePath)
  }
}
