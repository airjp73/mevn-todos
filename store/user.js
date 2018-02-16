import axios from 'axios'

export const state = () => ({
  user: false
})

/*export {default as actions} from '../test/actions.js'

export {default as mutations} from '../test/mutations.js'*/


export const actions = {
  async signup({ commit }, body) {
    try {
      var response = await axios.post('/api/signup', body)
      commit('user', response.data)
    }
    catch(err) {
      console.log(err)
    }
  },

  async login({ commit }, body) {
    try {
      var response = await axios.post('/api/login', body)
      commit('user', response.data)
    }
    catch(err) {
      console.log(err)
    }
  },

  async logout({ commit }) {
    try {
      await axios.post('api/logout')
      commit('user', false)
    }
    catch(err) {
      console.log(err)
    }
  },

  async addTodo({ commit }, body) {
    try {
      await axios.post('api/todo/add', body)
      commit('addTodo', body.todo)
    }
    catch(err) {
      console.log(err)
    }
  },

  async removeTodo({ commit }, body) {
    try {
      await axios.post('api/todo/remove', body)
      commit('removeTodo', body.todo)
    }
    catch(err) {
      console.log(err)
    }
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
