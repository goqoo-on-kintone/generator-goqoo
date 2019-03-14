import customize from './customize'

kintone.events.on('app.record.index.show', event => {
  event = customize(event)
  return event
})
