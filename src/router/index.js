import Vue from 'vue'
import Router from 'vue-router'
import Story from '@/components/story/Story.vue'
import Home from '@/components/home/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/story/:id',
      name: 'Story',
      component: Story
    }
  ]
})
