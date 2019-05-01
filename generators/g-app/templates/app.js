import swal from 'sweetalert'
import img from '../../.goqoo/img/SmallLogo.jpg'

kintone.events.on('app.record.index.show', event => {
  swal({
    text: 'Hello, Goqoo on kintone!',
    icon: img,
  })

  return event
})
