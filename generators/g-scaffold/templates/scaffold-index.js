import swal from 'sweetalert2'
import img from '../../.goqoo/img/SmallLogo.jpg'
import ordersCustomize from './customize'

kintone.events.on('app.record.index.show', event => {
  swal({
    text: 'Hello,  Goqoo on kintone!',
    confirmButtonText: 'OK',
    imageUrl: img,
    imageHeight: '200',
  })
  event = ordersCustomize(event)
  return event
})
