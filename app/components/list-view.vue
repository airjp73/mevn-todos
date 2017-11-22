<template>
  <v-container>
    <v-layout>
      <v-flex xs6 offset-xs3>
        <todo-input></todo-input>
        <ul>
          <todo-item class="todo-item" v-for="todo in myTodos"
            v-bind:item="todo"
            v-bind:key="todo.index"
            v-on:delete-todo="deleteTodo"></todo-item>
        </ul>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'list-view',
    methods: {
      deleteTodo(item) {
        var index = this.myTodos.findIndex(x => x.name == item);
        this.myTodos.splice(index, 1);
      }
    },
    computed: {
      myTodos() {return this.$store.state.items}
    }
  }
</script>

<style>
  /*.todo-item {
    margin-top: 10px;
    margin-bottom: 10px;
  }*/
</style>
