<template>
  <v-toolbar class="toolbar-spacing">
      <v-toolbar-title class="text-xs-center">MEVN Todos</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if='user && !user.emailConfirmed' v-on:click='resendConfirmation'>Resend Email Confirmation</v-btn>
      <logout-button v-if="user"></logout-button>
  </v-toolbar>
</template>

<script>
  import logoutButton from '../components/logout-button.vue'
  import { mapState } from 'vuex'

  export default {
    computed: mapState('user', [
      'user'
    ]),
    components: {
      'logout-button': logoutButton
    },
    methods: {
      resendConfirmation() {
        this.$store.dispatch('user/resendConfirmation')
      }
    }
  }
</script>
