import swal from 'sweetalert2'
import img from '../../.goqoo/img/SmallLogo.jpg'

kintone.events.on(
  ['app.record.create.submit', 'app.record.edit.submit', 'app.record.index.edit.submit'],
  async event => {
    const result = await swal({
      text: '保存してもよろしいですか？',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'キャンセル',
      imageUrl: img,
      imageHeight: '200',
    })
    if (!result.value) {
      return false
    }
    return event
  }
)
