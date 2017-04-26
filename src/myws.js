const uuid = require('uuid/v4')
window.WebSocket = window.WebSocket || window.MozWebSocket
window.messageStream = []
window.world = {
  currentTurn: {
    userId: null
  },
  user: JSON.parse(localStorage.getItem('_USER')) || { id: uuid() } // eventually generate on REST
}

export function connect() {
  window.myws = new WebSocket('ws://localhost:3000')

  window.myws.onopen = function() {
    console.info('connection established')
    window.myws.send(JSON.stringify({ action: 'INIT', data: { client: window.world.user } }))
  }

  window.myws.onerror = function(err) {
    console.error(err)
  }

  window.myws.onmessage = function(message) {
    const messageObj = JSON.parse(message.data)
    if (messageObj.action === 'TURN') {
      window.world.currentTurn.userId = messageObj.data.userId
    } else {
      window.messageStream.push(messageObj)
    }
  }
}
