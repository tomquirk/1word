<template>

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
  
</template>

<script src="./story.js"></script>

<style></style>
