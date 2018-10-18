'use strict'
const FileCopyGenerator = require('../common/file-copy-generator')
const Kintone = require('kintone')
const secret = require('./secret/secret')

module.exports = class extends FileCopyGenerator {
  configuring() {
    super.configuring()
  }

  kintone() {
    const appId = secret.KINTONE_APPID
    const api = new Kintone('the-red.cybozu.com', {
      authorization: {
        username: secret.KINTONE_USER,
        password: secret.KINTONE_PASSWORD,
      },
    })

    // アプリのフィールド一覧を取得
    api.form.get({ app: appId }, (err, response) => {
      if (err) {
        this.log.error(err)
      }
      const { properties } = response
      this.fieldMap = properties.reduce((obj, prop) => {
        // 特定のタイプのフィールドを全てカスタマイズビューに表示
        if (
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
      api.preview.app.views.put({ app: 83, views }, (err, response) => {
        if (err) {
          this.log.error(err)
        }

        this.fs.writeJSON(this.destinationPath(`apps/${this.appName}/fieldMap.json`), this.fieldMap)
      })
    })

    // TODO: JSのURLも自動的にデプロイ
    // api.preview.app.customize.get({ app: appId }, (err, response) => {
    //   if (err) {
    //     this.log.error(err)
    //   }
    //   this.log(response)
    // })
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
    this.fs.copy(this.templatePath(`customize.js`), this.destinationPath(`apps/${appName}/customize.js`))
    this.fs.copy(this.templatePath(`customize.html`), this.destinationPath(`apps/${appName}/customize.html`))
    this.fs.copy(this.templatePath(`customize.scss`), this.destinationPath(`apps/${appName}/customize.scss`))
  }
}
