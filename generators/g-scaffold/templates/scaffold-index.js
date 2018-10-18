import ordersCustomize from './customize'

kintone.events.on('app.record.index.show', event => {
  console.log('index', event)
  event = ordersCustomize(event)
  return event
})
