<template>
  <v-app dark>
    <toolbar></toolbar>
    <v-content>
      <v-container>
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
  export default {
    components: {
      'toolbar': toolbar,
    }
  }
</script>
