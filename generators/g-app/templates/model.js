import swal from 'sweetalert2'
import img from '../../.goqoo/img/SmallLogo.jpg'

kintone.events.on('app.record.index.show', event => {
  swal({
    text: 'Hello,  Goqoo on kintone!',
    confirmButtonText: 'OK',
    imageUrl: img,
    imageHeight: '200',
  })

  return event
})
