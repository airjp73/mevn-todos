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
        v-on:keyup.enter="login"
        required
      ></v-text-field>
      <v-text-field
        label="Password"
        v-model="password"
        :rules="validRules"
        :type="'password'"
        v-on:keyup.enter="login"
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

    <v-btn large color="blue darken-3" type="button" href='/api/facebook/login'>
      Facebook
    </v-btn>

    <v-btn large color="white black--text" type="button" href='/api/google/login'>
      Google
    </v-btn>

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

      this.$store.dispatch('auth/signup', body)
    },

    async login() {
      if (!this.valid)
        return

      var body = {
        email: this.email,
        password: this.password
      }

      this.$store.dispatch('auth/login', body)
    }
  }
}
</script>
