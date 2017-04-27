<template>
  <main>

    <section>
      <h2>Pick story</h2>
      <button @click.prevent="connectTo('11')">11</button>
      <button @click.prevent="connectTo('12')">12</button>
    </section>

    <section>
      <h1>MESSAGE</h1>
      <h2 v-show="currentTurn.userId === user.id">ITS YOUR TURN!</h2>
      {{user.id}}
      <input type="text" v-model="word">
      <button @click.prevent="send(word, user)">Send</button>
      <div v-for="word in story.words">
        {{word.text}}
      </div>
    </section>

  </main>
</template>

<script src="./chat.js"></script>

<style></style>
