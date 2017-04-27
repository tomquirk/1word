const uuid = require('uuid/v4')
window.WebSocket = window.WebSocket || window.MozWebSocket
window.world = {
  currentTurn: {
    userId: null
  },
  user: JSON.parse(localStorage.getItem('_USER')) || { id: uuid() }, // eventually generate on REST
  story: {
    name: null,
    id: null,
    words: []
  }
}
// localStorage.setItem('_USER', JSON.stringify(window.world.user))

export function connect(data) {
  if (window.myws) {
    window.myws.close()
  }

  window.myws = new WebSocket('ws://localhost:3000')

  window.myws.onopen = function() {
    console.info('connection established')
    const payload = JSON.stringify({ action: 'INIT', data })
    window.myws.send(payload)
  }

  window.myws.onerror = function(err) {
    console.error(err)
  }

  window.myws.onmessage = function(message) {
    const messageObj = JSON.parse(message.data)
    if (messageObj.action === 'TURN') {
      window.world.currentTurn.userId = messageObj.data.userId
    } else if (messageObj.action === 'STORY') {
      console.log(messageObj)
      Object.assign(window.world.story, messageObj.data)
    } else {
      window.world.story.words.push(messageObj.data)
    }
  }
}
