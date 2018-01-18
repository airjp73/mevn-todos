<template>
  <div>
    <p>
      Login
    </p>
    <form action="/api/login" method="post">
      <label>Email</label>
      <input type="text" id="email" name="email" />
      <label>Password</label>
      <input type="password" id="password" name="password" />
      <input type="submit" />
    </form>
  </div>
</template>

<script>
export default {
  methods: {
    async login() {
      var data = await axios.post('/api/login', {
        email: this.email,
        password: this.password
      })
    }
  }
}
</script>
