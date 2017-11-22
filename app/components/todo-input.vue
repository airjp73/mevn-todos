<template>
  <div>
    <h2>Enter new item</h2>
    <v-text-field dark
      name="New Todo"
      label="Enter Todo"
      v-model="myItem.name">
    </v-text-field>
    <button id="todoSubmit" v-on:click="addItem()">Create</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      myItem: {
        name: ""
      }
    }
  },
  methods: {
    addItem() {
      this.$store.dispatch("addItem", this.myItem)
    }
  }
}

</script>
