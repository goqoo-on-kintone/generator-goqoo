'use strict'
const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')
const prompts = require('./prompts')

module.exports = class extends Generator {
  prompting () {
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome to the outstanding ${chalk.red('generator-goqoo')} generator!`))

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props
    })
  }
  configuring () {
    this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('package.json'), {
      projectName: this.props.projectName,
    })
  }

  writing () {}

  install () {
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: true,
    })
  }
}
