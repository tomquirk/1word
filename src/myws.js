window.WebSocket = window.WebSocket || window.MozWebSocket
window.chat_user = {}
window.messageStream = []

export function connect() {
  window.myws = new WebSocket('ws://localhost:3000')

  window.myws.onopen = function() {
    console.info('connection established')
  }

  window.myws.onerror = function(err) {
    console.error(err)
  }

  window.myws.onmessage = function(message) {
    const messageObj = JSON.parse(message.data)
    if (messageObj.action === 'INIT') {
      window.chat_user.id = messageObj.data.client.id
    } else {
      console.log(messageObj)
      window.messageStream.push(messageObj)
    }
  }
}
