import Vuex from 'vuex'
import axios from 'axios'

export const actions = {
  async signup({ commit }, body) {
    try {
      var response = await axios.post('/api/signup', body)
      commit('user', response.data, {root: true})
    }
    catch(err) {
      console.log(err)
    }
  },

  async login({ commit }, body) {
    try {
      var response = await axios.post('/api/login', body)
      commit('user', response.data, {root: true})
    }
    catch(err) {
      console.log(err)
    }
  },

  async logout({ commit }) {
    try {
      await axios.post('api/logout')
      commit('user', false, {root: true})
    }
    catch(err) {
      console.log(err)
    }
  }
}
