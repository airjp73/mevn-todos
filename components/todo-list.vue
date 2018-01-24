<template>
  <ul>
    <li v-for="todo in user.todos">
      {{todo.text}}
    </li>
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
