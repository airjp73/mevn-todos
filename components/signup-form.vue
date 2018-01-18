<template>
  <div>
    <p>
      Signup
    </p>
    <form>
      <label>Email</label>
      <input type="text" id="email" name="email" />
      <label>Password</label>
      <input type="password" id="password" name="password" />
      <button v-on:click="signup">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  methods: {
    async signup() {
      var data = await axios.post('/api/signup', {
        email: this.email,
        password: this.password
      })

      alert(data.status)
    }
  }
}
</script>
