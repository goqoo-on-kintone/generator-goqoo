'use strict'
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  configuring () {
    this.appName = this.args[0]
  }

  writing () {
    const appName = this.appName
    ;['', '-index', '-detail', '-submit'].forEach(eventHandler =>
      this.fs.copyTpl(
        this.templatePath(`scaffold${eventHandler}.js`),
        this.destinationPath(`apps/${appName}/${appName}${eventHandler}.js`),
        { appName }
      )
    )
  }
}
