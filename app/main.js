/*
  Vue + 3rd party imports
*/
import Vue        from 'vue'
import VueRouter  from 'vue-router'
import Vuex       from 'vuex'
import Vuetify    from 'vuetify'
import VueAxios   from 'vue-axios'
import axios      from 'axios'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueAxios, axios)
Vue.use(Vuetify)

//import "reset-css"
//import "./main.css"
import "./node_modules/vuetify/dist/vuetify.min.css"

/*
  Vuex Store
*/
const store = new Vuex.Store({
  state: {
    items: []
  },
  mutations: {
    addItem(state, item) {
      state.items.push(item);
    },
    setItems(state, items) {
      state.items = items
    },
    removeItem(state, item) {
      var index = state.items.findIndex(x => x._id == item._id);
      state.items.splice(index, 1);
    }
  },
  actions: {
    loadItems(context) {
      var uri = "http://localhost:3000/api"
      axios.get(uri).then((response) => {

        context.commit("setItems", response.data)
      })
    },
    addItem(context, item) {
      var uri = "http://localhost:3000/api/add"
      axios.post(uri, item).then((response) => {
        console.log(response)
        context.commit("addItem", response.data)
      })
    },
    deleteItem(context, item) {
      console.log(item)
      var uri = "http://localhost:3000/api/delete/"
      axios.post(uri, item).then((response) => {
        console.log(response)
        context.commit("removeItem", item)
      })
    }
  }
})

/*
  Components
*/
//import
import altRoute from "./components/alt-route.vue"
import listView from "./components/list-view.vue"
import login from "./components/login.vue"
import navbar from "./components/navbar.vue"
import sidebar from "./components/sidebar.vue"
import todoInput from "./components/todo-input.vue"
import todoItem from "./components/todo-item.vue"

//register
//Vue.component("alt-route", altRoute)
//Vue.component("list-view", listView)
Vue.component("login", login)
Vue.component("navbar", navbar)
Vue.component("sidebar", sidebar)
Vue.component("todo-input", todoInput)
Vue.component("todo-item", todoItem)

/*
  Routes
*/
const routes = [
  {
    name: "TodoList",
    path: "/",
    component: listView
  },
  {
    name: "Hello",
    path: "/hello",
    component: altRoute
  }
]

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

/*
  App
*/
import App from './App.vue'
//new Vue(Vue.util.extend({router}, App)).$mount('#app')
new Vue({
  el: '#app',
  router,
  store,
  template: "<App/>",
  components: {App},
  created: function() {
    this.$store.dispatch("loadItems")
  }
}).$mount("#app")
