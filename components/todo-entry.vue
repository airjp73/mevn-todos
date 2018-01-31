<template>
  <v-container fluid>
    <v-layout row>
      <v-flex xs10>
        <v-text-field
          label="Enter todo"
          v-model="todoText"
          v-on:keyup.enter="addTodo"
        ></v-text-field>
      </v-flex>

      <v-flex xs2>
        <v-btn v-on:click="addTodo" flat>Enter</v-btn>
      </v-flex>

    </v-layout>
  </v-container>

</template>

<script>
  export default {
    data: () => {
      return {
        todoText: ""
      }
    },
    methods: {
      addTodo() {
        var text = this.todoText
        this.todoText=""

        var body = {
          todo: {
            text
          }
        }

        this.$store.dispatch('user/addTodo', body)

      }
    }
  }
</script>
