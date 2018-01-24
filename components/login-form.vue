<template>
  <div>
    <h2 class="display-1">
      Login
    </h2>
    <v-form v-model="valid">

      <v-text-field
        label="Email"
        v-model="email"
        :rules="validRules"
        required
      ></v-text-field>
      <v-text-field
        label="Password"
        v-model="password"
        :rules="validRules"
        :type="'password'"
        required
      ></v-text-field>

      <v-btn
        v-on:click="login"
        :disabled="!valid"
      >Login</v-btn>
      <v-btn type="button"
        v-on:click="signup"
        :disabled="!valid"
      >Signup</v-btn>

    </v-form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data: () => {
    return {
      email: "",
      validRules: [
        (val) => val.length > 0 || 'Required'
      ],
      password: "",
      valid: false
    }
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
      if (!this.valid)
        return

      var body = {
        email: this.email,
        password: this.password
      }

      this.$store.dispatch('login', body)
    }
  }
}
</script>
