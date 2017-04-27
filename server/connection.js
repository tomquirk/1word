const WebSocket = require('ws')
const stories = require('./db').stories

let connPool = {}
let turnQueue = []

const wss = new WebSocket.Server({ port: 3000 })

wss.broadcast = function broadcast(message) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message))
    }
  })
}

wss.on('connection', function connection(ws) {
  let connId = 0

  ws.on('message', function incoming(message) {
    const messageObj = JSON.parse(message)
    if (messageObj.action === 'INIT') {
      connId = messageObj.data.clientId
      console.log('User connected: ', connId, ' :: ', messageObj.data.storyId)
      enqueueTurn(connId)
      const story = stories[messageObj.data.storyId]
      story.id = messageObj.data.storyId
      ws.send(JSON.stringify({ action: 'STORY', data: story }))
    } else {
      const data = {
        text: messageObj.data.word,
        userId: connId
      }
      if (turnQueue[0] === connId) {
        wss.broadcast({ action: 'MESSAGE', data })
      }
    }
  })

  ws.on('close', function() {
    delete connPool[connId]
    turnQueue.splice(turnQueue.indexOf(connId), 1)
  })
})

function enqueueTurn(connId) {
  turnQueue.push(connId)
  console.log(turnQueue)
}

function dequeueTurn() {
  if (turnQueue.length === 0) {
    return null
  }

  const connId = turnQueue.splice(0, 1)
  enqueueTurn(connId[0])
  return turnQueue[0]
}

module.exports = { wss, enqueueTurn, dequeueTurn }
