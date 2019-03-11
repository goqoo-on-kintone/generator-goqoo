'use strict'
const FileCopyGenerator = require('../common/file-copy-generator')
const Kintone = require('kintone')
const prompts = require('./prompts')
const { promisifyKintoneApiCaller: promisify } = require('../common/utils')

module.exports = class extends FileCopyGenerator {
  initializing() {
    if (this.args[0]) {
      ;[this.appName, this.appId] = this.args[0].split(':')
    }
    if (!this.appName || !this.appId) {
      this.log(`${this.appName ? 'App id is' : 'Both App name and id are'} required!`)
      process.exit(1)
    }
  }

  prompting() {
    return this.prompt(prompts).then(_ => {
      this.kintoneAccount = _
    })
  }

  kintone() {
    const appId = this.appId
    const appName = this.appName

    const api = new Kintone(this.kintoneAccount.domain, {
      authorization: {
        username: this.kintoneAccount.username,
        password: this.kintoneAccount.password,
      },
    })
    // yeoman に非同期実行開始を通知
    // 非同期実行がすべて終わった時点で done() を呼び出す
    // done() が呼び出されないかぎり次のタスクは実行されない
    const done = this.async()

    // アプリのフィールド一覧を取得
    promisify(api.form.get)({ app: appId })
      .then(response => {
        const { properties } = response
        this.fieldMap = properties.reduce((obj, prop) => {
          // 特定のタイプのフィールドを全てカスタマイズビューに表示
          if (
            Object.keys(obj).length < 10 &&
            [
              'SINGLE_LINE_TEXT',
              'NUMBER',
              'MULTI_LINE_TEXT',
              'RADIO_BUTTON',
              'DROP_DOWN',
              'DATE',
              'TIME',
              'DATETIME',
            ].includes(prop.type)
          ) {
            obj[prop.code] = prop
          }
          return obj
        }, {})
        return promisify(api.preview.app.views.get)({ app: appId })
      })
      .then(response => {
        const { views } = response
        views.カスタマイズビュー = {
          type: 'CUSTOM',
          name: 'カスタマイズビュー',
          filterCond: '',
          sort: 'レコード番号 desc',
          index: -1,
          html: '<div id="customize-view"></div>',
          pager: true,
        }
        return promisify(api.preview.app.views.put)({ app: appId, views })
      })
      .then(() => {
        this.log.ok('Put views to kintone')
        this.fs.writeJSON(this.destinationPath(`apps/${appName}/fieldMap.json`), this.fieldMap)

        // JSのURLをデプロイ
        const port = process.env.PORT || 59000
        return promisify(api.preview.app.customize.put)({
          app: appId,
          desktop: {
            js: [
              {
                type: 'URL',
                url: `https://localhost:${port}/${appName}.js`,
              },
            ],
          },
        })
      })
      .then(() => {
        this.log.ok('Put JavaScript URL to kintone')
        return promisify(api.preview.app.deploy.post)({ apps: [{ app: appId }] })
      })
      .then(() => {
        this.log.ok('Deploy to kintone')
        // yeoman に非同期実行完了を通知
        done()
      })
      .catch(error => {
        this.env.error(error)
      })
  }

  writing() {
    super.writing()

    // Create JS source code
    const appName = this.appName
    ;[
      'index.js',
      'on-index-show.js',
      'on-detail-show.js',
      'on-edits-show.js',
      'on-edits-submit.js',
      'customize.js',
      'customize.html',
      'customize.scss',
    ].forEach(fileName =>
      this.fs.copyTpl(this.templatePath(fileName), this.destinationPath(`apps/${appName}/${fileName}`), { appName })
    )
  }
}
