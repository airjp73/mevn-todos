import Vuex from 'vuex'
import axios from 'axios'

export default () => {
  return new Vuex.Store({
    state: {
      user: false
    },
    actions: {
      nuxtServerInit({ commit }, { req }) {
        //since this is called on the server side, toObject is necessary
        if (req.isAuthenticated())
          commit('user', req.user.toObject())

      },

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
      }
    },
    mutations: {
      user(state, user) {
        state.user = user
      }
    }
  })
}
