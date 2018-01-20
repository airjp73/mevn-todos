<template>
  <div>
    <logout-button v-if="user" />
    <login-form v-else />

  </div>
</template>

<script>
import loginForm from "../components/login-form.vue"
import logoutButton from "../components/logout-button.vue"
import { mapState } from 'vuex'

export default {
  computed: mapState([
    'user'
  ]),
  components: {
    'login-form': loginForm,
    'logout-button': logoutButton
  }
}
</script>
