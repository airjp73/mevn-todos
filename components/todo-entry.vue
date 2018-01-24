<template>
  <div>
    <v-text-field
      label="Enter todo"
      v-model="newTodo"
    ></v-text-field>
    <v-btn v-on:click="addTodo">Enter</v-btn>
  </div>
</template>

<script>
  export default {
    data: {
      newTodo: ""
    },
    methods: {
      async addTodo() {
        var body = {
          todo: this.newTodo
        }

        this.$store.dispatch('addTodo', body)
      }
    }
  }
</script>
