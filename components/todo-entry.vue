<template>
  <v-container fluid>
    <v-layout row>
      <v-flex xs10>
        <v-text-field
          label="Enter todo"
          v-model="newTodo"
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
    data: {
      newTodo: ""
    },
    methods: {
      async addTodo() {
        alert("pressed")
        /*var body = {
          todo: this.newTodo
        }

        this.$store.dispatch('addTodo', body)*/
      }
    }
  }
</script>
