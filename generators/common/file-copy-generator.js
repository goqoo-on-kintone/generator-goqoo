'use strict'
const Generator = require('yeoman-generator')
const fs = require('fs')
const chalk = require('chalk')
const yaml = require('js-yaml')

const padding = str => ('         ' + str).substr(-9) + ' '
const coloredMessage = (color, fileStatus, relativePath) => chalk[color](padding(fileStatus)) + relativePath
const message = {
  error: m => coloredMessage('red', 'Error', m),
  force: m => coloredMessage('yellow', 'force', m),
}
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
      this.log(message.error(`App '${appName}' already exists!`))
      process.exit(1)
    }
    config.apps.push(appName)
    const configStr = yaml.safeDump(config)
    fs.writeFileSync(this.destinationPath(configRelativePath), configStr)
    this.log(message.force(configRelativePath))
  }
}
