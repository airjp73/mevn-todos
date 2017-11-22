<template>
  <div>
    <button v-on:click="deleteTodo">X</button>
    <li>{{item.name}}</li>
  </div>
</template>

<script>
export default {
  name: 'list-view',
  props: [
    "item"
  ],
  methods: {
    deleteTodo: function() {
      this.$store.dispatch("deleteItem", this.item)
    }
  }
}


</script>

<style>
  /*input {
    display:inline-block;
  }

  li {
    display:inline-block;
  }*/
</style>
