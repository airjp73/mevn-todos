<template>
  <div>
    <p>
      Login
    </p>
    <form>
      <label>Email</label>
      <input type="text" ref="email" name="email" />
      <label>Password</label>
      <input type="password" ref="password" name="password" />
      <button type="button" v-on:click="login" >Login</button>
      <button type="button" v-on:click="signup" >Signup</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  methods: {
    async signup() {
      var email = this.$refs.email.value
      var password = this.$refs.password.value
      var body = {
        email,
        password
      }

      this.$store.dispatch('signup', body)
    },

    async login() {
      var email = this.$refs.email.value
      var password = this.$refs.password.value
      var body = {
        email,
        password
      }

      this.$store.dispatch('login', body)
    }
  }
}
</script>
