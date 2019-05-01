import Vue from 'vue'
import swal from 'sweetalert'
import HTML_TEMPLATE from './customize.html'
import './customize.scss'
import fieldMap from './fieldMap.json'
import img from '../../.goqoo/img/SmallLogo.jpg'

export default event => {
  if (event.viewName !== 'カスタマイズビュー') {
    return
  }

  swal({
    text: 'Hello, Goqoo on kintone!',
    icon: img,
  })

  // kintoneに設定済みのタグを自作のHTMLファイルで置換
  const divNode = document.querySelector('#customize-view')
  divNode.insertAdjacentHTML('beforebegin', HTML_TEMPLATE)
  ;(async () => {
    new Vue({
      // Vueを適用するHTML_TEMPLATE内のelement
      el: '#customize-view-inner',
      data: {
        records: event.records,
        fieldMap,
      },
      methods: {
        dummyAlert(e) {
          const buttonName = e.target.innerHTML || e.target.value
          swal(`「${buttonName}」ボタンはダミーです。`)
        },
      },
    })
  })()
}
