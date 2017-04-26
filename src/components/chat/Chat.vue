<template>
  <main>
    <h1>MESSAGE</h1>
    <input type="text" v-model="msg">
    <button @click.prevent="send(msg, user)">Send</button>
    <div v-for="m in messages">
      {{m.data.user.id}}> {{m.data.msg}}
    </div>
  </main>
</template>

<script src="./chat.js"></script>

<style></style>
