<template>
  <v-toolbar class="toolbar-spacing">
      <v-toolbar-title class="text-xs-center">MEVN Todos</v-toolbar-title>
      <v-spacer></v-spacer>
      <logout-button v-if="user"></logout-button>
  </v-toolbar>
</template>

<script>
  import logoutButton from '../components/logout-button.vue'
  import { mapState } from 'vuex'

  export default {
    computed: mapState([
      'user'
    ]),
    components: {
      'logout-button': logoutButton
    }
  }
</script>
