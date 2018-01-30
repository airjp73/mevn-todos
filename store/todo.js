import Vuex from 'vuex'
import axios from 'axios'

export const actions = {
  async add({ commit }, body) {
    try {
      await axios.post('api/todo/add', body)
      commit('addTodo', body.todo, {root: true})
    }
    catch(err) {
      console.log(err)
    }
  },

  async remove({ commit }, body) {
    try {
      await axios.post('api/todo/remove', body)
      commit('removeTodo', body.todo, {root: true})
    }
    catch(err) {
      console.log(err)
    }
  }
}
