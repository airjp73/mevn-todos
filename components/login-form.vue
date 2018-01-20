<template>
  <div>
    <h2 class="display-3">
      Login
    </h2>
    <form>
      <v-text-field
        label="Email"
        v-model="email"
        required
      ></v-text-field>
      <v-text-field
        label="Password"
        v-model="password"
        :type="'password'"
        required
      ></v-text-field>
      <v-btn v-on:click="login" >Login</v-btn>
      <v-btn type="button" v-on:click="signup" >Signup</v-btn>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data: {
    email: "",
    password: ""
  },
  methods: {
    async signup() {
      var body = {
        email: this.email,
        password: this.password
      }

      this.$store.dispatch('signup', body)
    },

    async login() {
      var body = {
        email: this.email,
        password: this.password
      }

      this.$store.dispatch('login', body)
    }
  }
}
</script>
