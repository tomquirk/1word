<template>

  <section>

    <div id="sidebar">
      <h2>{{currentTurn.userId === user.id ? 'ITS YOUR TURN!' : 'WAIT YOUR TURN!'}}</h2>
      <small>{{user.id}}</small>
      <form @submit.prevent="send(word, user)">
        <input type="text" v-model="word">
        <button>Add To Story</button>
      </form>
    </div>

    <div id="story">
      <span v-for="word in story.words">{{word.text}} </span>
    </div>

  </section>

</template>

<script src="./story.js"></script>

<style lang="stylus" src="./story.styl"></style>
