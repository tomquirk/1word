import * as myws from '@/myws'

export default {
  name: 'story',
  data() {
    return {
      word: '',
      showMyWords: false,
      world: window.world
    }
  },
  methods: {
    send(word, user) {
      window.myws.send(JSON.stringify({ action: 'MESSAGE', data: { word, user, storyId: this.story.id } }))
    },
    connectTo(storyId) {
      const payload = {
        clientId: this.world.user.id,
        storyId
      }
      myws.connect(payload)
    }
  },
  created() {
    this.connectTo(this.$route.params.id)
  }
}
