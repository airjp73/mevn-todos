<template>
  <div>
    <p>
      Welcome!
    </p>
    <signup-form/>
    <login-form/>
  </div>
</template>

<script>
import loginForm from "../components/login-form.vue"
import signupForm from "../components/signup-form.vue"

export default {
  components: {
    'login-form': loginForm,
    'signup-form': signupForm
  }
}
</script>
