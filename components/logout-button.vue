<template>
  <button type="button" v-on:click="logout">Logout</button>
</template>

<script>
  import axios from 'axios'

  export default {
    methods: {
      logout() {
        this.$store.dispatch('logout')
      }
    }
  }
</script>
