<template>
  <v-list>
    <todo-list-item
      v-for="todo in user.todos"
      v-bind:todo="todo"
      key="todo.text"
    ></todo-list-item>
  </v-list>
</template>

<script>
  import todoListItem from './todo-list-item.vue'
  import { mapState } from 'vuex'
  export default {
    computed: mapState([
      'user'
    ]),
    components: {
      'todo-list-item' : todoListItem
    }
  }
</script>
