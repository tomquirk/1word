const WebSocket = require('ws')
const uuid = require('uuid/v4')

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
  // connPool[connId] = ws

  // // send user their ID
  // ws.send(JSON.stringify({ action: 'INIT', data: { client: { id: connId } } }))

  ws.on('message', function incoming(message) {
    const messageObj = JSON.parse(message)
    if (messageObj.action === 'INIT') {
      connId = messageObj.data.client.id
      console.log('User connected: ', connId)
      enqueueTurn(connId)
    } else {
      wss.broadcast({ action: 'MESSAGE', data: messageObj.data })
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
