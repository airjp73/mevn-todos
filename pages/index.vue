<template>
  <div>
    <p>
      Welcome!
    </p>
    <login-form/>
  </div>
</template>

<script>
import loginForm from "../components/login-form.vue"

export default {
  components: {
    'login-form': loginForm
  }
}
</script>
