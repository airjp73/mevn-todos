<template>
  <v-list-tile>

    <v-list-tile-content>
      <v-list-tile-title>{{todo.text}}</v-list-tile-title>
    </v-list-tile-content>

    <v-list-tile-action>
      <v-btn icon ripple v-on:click="removeTodo">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-list-tile-action>

  </v-list-tile>
</template>

<script>
  export default {
    props: ['todo'],
    methods: {
      removeTodo() {
        var body = {
          todo: this.todo
        }

        this.$store.dispatch('todo/remove', body)
      }
    }
  }
</script>
