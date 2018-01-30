import Vuex from 'vuex'
import axios from 'axios'

export const state = () => ({
  user: false
})

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (req.isAuthenticated())
      commit('user', req.user.toObject())
  }
}

export const mutations = {
  user(state, user) {
    state.user = user
  },
  addTodo(state, todo) {
    state.user.todos.push(todo)
  },
  removeTodo(state, todo) {
    var index = state.user.todos.findIndex((userTodo) => {
      for (var field in todo) {
        if (!userTodo.hasOwnProperty(field) || userTodo[field] !== todo[field])
          return false
      }
      return true
    })

    state.user.todos.splice(index, 1)
  }
}
