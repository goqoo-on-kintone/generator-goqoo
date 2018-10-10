kintone.events.on('app.record.index.show', event => {
  console.warn(event)
  window.alert('hello, Goqoo on kintone!')
  return event
})
