const WebSocket = require('ws')
const stories = require('./db').stories

const turnQueue = {}
const connPool = {}
stories.forEach(s => {
  connPool[s.id] = {}
  turnQueue[s.id] = []
})

const wss = new WebSocket.Server({ port: 3000 })

wss.broadcast = function broadcast(storyId, message) {
  Object.values(connPool[storyId]).forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message))
    }
  })
}

wss.on('connection', function connection(ws) {
  let connId = 0
  let queue = []

  ws.on('message', function incoming(message) {
    const messageObj = JSON.parse(message)
    console.log(messageObj)
    const storyId = messageObj.data.storyId

    if (messageObj.action === 'INIT') {
      connId = messageObj.data.clientId
      console.log('User connected: ', connId, ' :: ', storyId)
      connPool[storyId][connId] = ws
      queue = turnQueue[storyId]
      enqueueTurn(queue, connId)
      const story = stories.find(s => s.id === storyId)
      ws.send(JSON.stringify({ action: 'STORY', data: story }))
    } else {
      const data = {
        text: messageObj.data.word,
        userId: connId
      }
      // check if its this users turn
      if (queue[0] === connId) {
        wss.broadcast(storyId, { action: 'MESSAGE', data })
      }
    }
  })

  ws.on('close', function() {
    delete queue[connId]
    queue.splice(queue.indexOf(connId), 1)
  })
})

function enqueueTurn(queue, element) {
  queue.push(element)
  console.log(queue)
}

function dequeueTurn(queue) {
  if (queue.length === 0) {
    return null
  }

  const element = queue.splice(0, 1)
  enqueueTurn(element[0])
  return queue[0]
}

/**
 * Recursive function that broadcasts current turn and initiates next turn
 */
function turnLoop() {
  setTimeout(() => {
    const currentTurnId = dequeueTurn()
    wss.broadcast({ action: 'TURN', data: { userId: currentTurnId } })
    turnLoop()
  }, 3000)
}

module.exports = { wss, enqueueTurn, dequeueTurn }
