<template>
  <div>
    <v-text-field
      label="Email"
      v-model="email"
      v-on:keyup.enter="submit"
    ></v-text-field>
    <v-btn v-on:click="submit" flat>Submit</v-btn>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data: () => {
    return {
      email: ""
    }
  },
  methods: {
    async submit() {
      var body = {
        email: this.email
      }

      try {
        await axios.post('/api/forgotPassword', body)
        this.$nuxt.$router.push({path: '/'})
      }
      catch (err) {
        //flash message probably
        console.log(err)
      }

    }
  }
}
</script>
