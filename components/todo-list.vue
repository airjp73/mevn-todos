<template>
  <ul>
    <v-list>
      <v-list-tile v-for="todo in user.todos" v-bind:key="todo.text">
        <v-list-tile-content>
          <v-list-tile-title>{{todo.text}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </ul>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    computed: mapState([
      'user'
    ])
  }
</script>
