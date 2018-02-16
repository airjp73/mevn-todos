
export const state = () => ({
  info: []
})

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (req.isAuthenticated())
      commit('user/user', req.user.toObject())

    var info = req.flash('info')
    if (info)
      commit('setInfo', info)
  },
  clearInfo({ commit }) {
    commit('clearInfo')
  },
  flash({ commit }, message) {
    commit('pushMessage', message)
  }
}

export const mutations = {
  setInfo(state, payload) {
    state.info = payload
  },
  clearInfo(state) {
    state.info = []
  },
  pushMessage(state, message) {
    state.info.push(message)
  }
}
