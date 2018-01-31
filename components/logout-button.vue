<template>
  <v-btn v-on:click="logout" flat>Logout</v-btn>
</template>

<script>
  import axios from 'axios'

  export default {
    methods: {
      logout() {
        this.$store.dispatch('user/logout')
      }
    }
  }
</script>
