<template>
  <v-list>
    <todo-list-item
      v-for="(todo, index) in user.todos"
      v-bind:todo="todo"
      v-bind:key="index"
    ></todo-list-item>

    <h2
      v-if="user.todos.length === 0"
      class="text-xs-center display-1 grey--text text--lighten-1">
      Enter a todo to get started
    </h2>
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
