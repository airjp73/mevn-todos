<template>
  <div>
    <div v-if="user">
      <todo-entry></todo-entry>
      <todo-list></todo-list>
    </div>
    <login-form v-else />

  </div>
</template>

<script>
import loginForm from "../components/login-form.vue"
import logoutButton from "../components/logout-button.vue"
import todoEntry from "../components/todo-entry.vue"
import todoList from '../components/todo-list.vue'
import { mapState } from 'vuex'

export default {
  computed: mapState([
    'user'
  ]),
  components: {
    'login-form': loginForm,
    'logout-button': logoutButton,
    'todo-list' : todoList,
    'todo-entry' : todoEntry
  }
}
</script>
