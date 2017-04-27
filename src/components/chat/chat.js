import * as myws from '@/myws'

export default {
  name: 'chat',
  data() {
    return {
      word: '',
      story: window.world.story,
      user: window.world.user,
      currentTurn: window.world.currentTurn
    }
  },
  methods: {
    send(word, user) {
      window.myws.send(JSON.stringify({ action: 'MESSAGE', data: { word, user, storyId: this.story.id } }))
    },
    connectTo(storyId) {
      const payload = {
        clientId: this.user.id,
        storyId
      }
      myws.connect(payload)
    }
  }
}
