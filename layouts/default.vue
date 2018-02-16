<template>
  <v-app dark>
    <toolbar></toolbar>
    <v-content>
      <v-container>
        <flash v-if="info.length" v-bind:message="info"></flash>
        <v-layout row wrap>
          <v-flex md6 offset-md3>
            <nuxt />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import toolbar from '../components/toolbar.vue'
  import flash from '../components/flash.vue'

  export default {
    data: () => ({
      info: []
    }),
    components: {
      'toolbar': toolbar,
      'flash' : flash
    },
    mounted() {
      this.info = this.$store.state.info
      this.$store.commit('clearInfo')
    }
  }
</script>
