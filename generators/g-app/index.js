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
    this.fs.copyTpl(this.templatePath(`model.js`), this.destinationPath(`apps/${appName}/index.js`), { appName })
  }
}
