const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 3000 })

let connPool = []

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ action: 'MESSAGE', data }))
    }
  })
}

wss.on('connection', function connection(ws) {
  connPool.push(ws)
  const clientId = connPool.length - 1
  ws.send(JSON.stringify({ action: 'INIT', data: { client: { id: clientId } } }))

  ws.on('message', function incoming(data) {
    wss.broadcast(JSON.parse(data))
  })

  ws.on('close', function() {
    connPool.splice(clientId, 1)
  })
})
