const uuid = require('uuid/v4')
window.WebSocket = window.WebSocket || window.MozWebSocket
window.world = {
  currentTurn: {
    userId: null,
    timeRemaining: 0
  },
  user: JSON.parse(localStorage.getItem('_USER')) || { id: uuid() }, // eventually generate on REST
  story: {
    name: null,
    id: null,
    words: []
  },
  users: []
}
// localStorage.setItem('_USER', JSON.stringify(window.world.user))

export function connect(data) {
  if (window.myws) {
    window.myws.close()
  }

  window.myws = new WebSocket(`ws://${window.location.hostname}:3000`)

  window.myws.onopen = function() {
    console.info('connection established')
    const payload = JSON.stringify({ action: 'INIT', data })
    window.myws.send(payload)
  }

  window.myws.onerror = function(err) {
    console.error('WS ERROR::', err)
  }

  window.myws.onmessage = function(message) {
    const messageObj = JSON.parse(message.data)
    console.log(messageObj.action)
    switch (messageObj.action) {
      case ('TURN'):
        window.world.currentTurn.userId = messageObj.data.userId
        window.world.currentTurn.timeRemaining = messageObj.data.timeRemaining ||
          (messageObj.data.userId === window.world.user.id ? 'YOUR TURN' : 0)
        break

      case ('USER_UPDATE'):
        let user = window.world.users.find(u => u.id === message.data.id)
        if (user) {
          Object.assign(user, messageObj.data)
        } else {
          window.world.users.push(messageObj.data)
        }

        if (messageObj.data.id === window.world.user.id) {
          Object.assign(window.world.user, messageObj.data)
        }

        break

      case ('STORY'):
        console.log(messageObj)
        Object.assign(window.world.story, messageObj.data)
        break

      case ('MESSAGE'):
        window.world.story.words.push(messageObj.data)
        break
    }
  }
}
