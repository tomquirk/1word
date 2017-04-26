export default {
  name: 'chat',
  data() {
    return {
      msg: '',
      messages: window.messageStream,
      user: window.chat_user
    }
  },
  methods: {
    send(msg, user) {
      window.myws.send(JSON.stringify({ msg, user }))
    }
  }
}
