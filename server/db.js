// var redis = require('redis')
// var client = redis.createClient(port, 'hostname', { no_ready_check: true })
// client.auth('password', function(err) {
//   if (err) throw err
// })

// client.on('connect', function() {
//   console.log('Connected to Redis')
// })


const stories = [
  {
    id: '11',
    name: '1984',
    words: [
      { userId: 0, text: 'Hey' },
      { userId: 0, text: 'There' }
    ]
  },
  {
    id: '12',
    name: 'Mockingbird',
    words: [
      { userId: 0, text: 'Mock' },
      { userId: 0, text: 'Me' }
    ]
  }
]

module.exports = { stories }
