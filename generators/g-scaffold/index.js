'use strict'
const FileCopyGenerator = require('../common/file-copy-generator')

module.exports = class extends FileCopyGenerator {
  configuring() {
    super.configuring()
  }

  writing() {
    super.writing()

    // Create JS source code
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
