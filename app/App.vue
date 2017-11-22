<template>
  <v-app dark>
    <v-navigation-drawer app>
      <login></login>
    </v-navigation-drawer>
    <v-toolbar app></v-toolbar>
    <main>
      <v-content>
        <v-container>
          <router-view></router-view>
        </v-container>
      </v-content>
    </main>
    <v-footer app></v-footer>
  </v-app>
  <!--<div id="app">
    <navbar></navbar>
    <div>
      <div class="body-container">
        <router-view></router-view>
      </div> -->

      <!--<list-view class="body-container"></list-view>-->
  <!--    <sidebar class="sidebar-container"></sidebar>
    </div>
  </div>-->
</template>

<script>
export default {
  name: 'app',
  data () {
    return {}
  }
}
</script>

<style>
  /*.body-container {
    width: 75%;
    float: left;
    height: 500px;
  }
  .sidebar-container {
    width:25%;
    float:left;
  }*/
</style>
