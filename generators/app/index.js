'use strict'
const Generator = require('../common/generator')
const chalk = require('chalk')
const yosay = require('yosay')
const prompts = require('./prompts')

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome to the outstanding ${chalk.red('generator-goqoo')} generator!`))

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props
    })
  }

  configuring() {
    this.log.run(`git init`)
    const gitInit = this.spawnCommandSync('git', ['init'])
    if (gitInit.status !== 0) {
      this.env.error(`git process exited with code ${gitInit.status}`)
    }

    this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('package.json'), {
      projectName: this.props.projectName,
    })
  }

  writing() {
    // Copy all static files
    this.fs.copy(this.templatePath('static'), this.destinationRoot(), {
      globOptions: { dot: true },
    })
    this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'))
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: true,
    })
  }
}
