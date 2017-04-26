export default {
  name: 'chat',
  data() {
    return {
      msg: '',
      messages: window.messageStream,
      user: window.world.user,
      currentTurn: window.world.currentTurn
    }
  },
  methods: {
    send(msg, user) {
      window.myws.send(JSON.stringify({ action: 'MESSAGE', data: { msg, user } }))
    }
  }
}
