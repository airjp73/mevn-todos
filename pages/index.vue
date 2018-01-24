<template>
  <div>
    <div v-if="user">
      <todo-list></todo-list>
    </div>
    <login-form v-else />

  </div>
</template>

<script>
import loginForm from "../components/login-form.vue"
import logoutButton from "../components/logout-button.vue"
import todoList from '../components/todo-list.vue'
import { mapState } from 'vuex'

export default {
  computed: mapState([
    'user'
  ]),
  components: {
    'login-form': loginForm,
    'logout-button': logoutButton,
    'todo-list' : todoList
  }
}
</script>
