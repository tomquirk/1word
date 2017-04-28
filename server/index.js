const WebSocket = require('ws')
const stories = require('./db').stories

const colors = ['r', 'g', 'b']

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

function createUser(id, queue) {
  return {
    id,
    name: `User ${queue.length}`,
    color: colors.filter(c => queue.map(e => e.color).indexOf(c) === -1)[0] || 'w'
  }
}

wss.on('connection', function connection(ws) {
  let connId = 0
  let queue = []

  ws.on('message', function incoming(message) {
    const messageObj = JSON.parse(message)
    console.log(messageObj)
    const story = stories.find(s => s.id === messageObj.data.storyId)

    switch (messageObj.action) {
      case ('INIT'):
        connId = messageObj.data.clientId
        console.log('User connected: ', connId, ' :: ', story.id)
        connPool[story.id][connId] = ws
        queue = turnQueue[story.id]
        const user = createUser(connId, queue)
        enqueueTurn(queue, user)

        if (queue.length === 1) {
          turnLoop(story.id, queue)
        }

        ws.send(JSON.stringify({ action: 'STORY', data: story }))
        queue.forEach(u => {
          if (u.id !== connId) {
            ws.send(JSON.stringify({ action: 'USER_UPDATE', data: u }))
          }
        })
        wss.broadcast(story.id, { action: 'USER_UPDATE', data: user })
        break

      case ('USER_UPDATE'):
        wss.broadcast(story.id, messageObj)
        break

      case ('MESSAGE'):
        const data = {
          text: messageObj.data.word,
          userId: connId
        }
        // check if its this users turn
        if (queue[0].id === connId) {
          wss.broadcast(story.id, { action: 'MESSAGE', data })
          story.words.push(data)
        }
        break
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
  enqueueTurn(queue, element[0])
  return queue[0]
}

/**
 * Recursive function that broadcasts current turn and initiates next turn
 */
function turnLoop(storyId, queue) {
  setInterval(() => {
    const currentTurn = dequeueTurn(queue)
    wss.broadcast(storyId, { action: 'TURN', data: { userId: currentTurn.id } })
  }, 3000)
}

module.exports = { wss, enqueueTurn, dequeueTurn }
