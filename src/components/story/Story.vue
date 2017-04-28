<template>

  <section>

    <div id="sidebar">
      <h1>{{world.story.name}}</h1>
      <h2>
        <template v-if="world.currentTurn.userId === world.user.id">
          0:{{world.currentTurn.timeRemaining >= 10 ? '' : 0}}{{world.currentTurn.timeRemaining}}
        </template>
        <template v-else>0:00</template>
      </h2>
      <form @submit.prevent="send(word, world.user)">
        <input type="text" v-model="word">
        <button>Add To Story</button>
      </form>
      <label for="showMyWords">Show my words</label>
      <input type="checkbox" v-model="showMyWords">

      <h1>Writers</h1>
      <div class="user-label" v-for="user in Object.values(world.users)">
        {{user.name}}
        <span v-if="user.id === world.currentTurn.userId && user.id !== world.user.id"> - {{world.currentTurn.timeRemaining}}</span>
      </div>
    </div>

    <div id="story">
      <span v-for="word in world.story.words" :class="{ 'highlight': showMyWords && word.userId === world.user.id }">{{word.text}} </span>
    </div>

  </section>

</template>

<script src="./story.js"></script>

<style lang="stylus" src="./story.styl"></style>
