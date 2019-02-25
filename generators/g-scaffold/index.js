'use strict'
const FileCopyGenerator = require('../common/file-copy-generator')
const Kintone = require('kintone')
const prompts = require('./prompts')

module.exports = class extends FileCopyGenerator {
  configuring() {
    super.configuring()
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

    // アプリのフィールド一覧を取得
    api.form.get({ app: appId }, (err, response) => {
      if (err) {
        this.log.error(err)
      }
      const { properties } = response
      this.fieldMap = properties.reduce((obj, prop, index) => {
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
    })

    // カスタマイズビュー用の一覧をトップに追加
    api.preview.app.views.get({ app: appId }, (err, response) => {
      if (err) {
        this.log.error(err)
      }
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
      api.preview.app.views.put({ app: appId, views }, (err, response) => {
        if (err) {
          this.log.error(err)
        }

        this.log.ok('Put views to kintone')
        this.fs.writeJSON(this.destinationPath(`apps/${appName}/fieldMap.json`), this.fieldMap)

        // JSのURLをデプロイ
        const port = process.env.PORT || 59000
        api.preview.app.customize.put(
          {
            app: appId,
            desktop: {
              js: [
                {
                  type: 'URL',
                  url: `https://localhost:${port}/${appName}.js`,
                },
              ],
            },
          },
          (err, response) => {
            if (err) {
              this.log.error(err)
            }
            this.log.ok('Put JavaScript URL to kintone')

            api.preview.app.deploy.post({ apps: [{ app: appId }] }, (err, response) => {
              if (err) {
                this.log.error(err)
              }
              this.log.ok('Deploy to kintone')
            })
          }
        )
      })
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
      this.fs.copyTpl(
        this.templatePath(fileName),
        this.destinationPath(`apps/${appName}/${fileName}`),
        { appName }
      )
    )
  }
}
