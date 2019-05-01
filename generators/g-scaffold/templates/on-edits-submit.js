import swal from 'sweetalert'
import img from '../../.goqoo/img/SmallLogo.jpg'

kintone.events.on(
  ['app.record.create.submit', 'app.record.edit.submit', 'app.record.index.edit.submit'],
  async event => {
    const confirmed = await swal({
      text: '保存してもよろしいですか？',
      buttons: true,
      icon: img,
    })
    if (!confirmed) {
      return false
    }
    return event
  }
)
