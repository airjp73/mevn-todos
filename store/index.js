
export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (req.isAuthenticated())
      commit('user/user', req.user.toObject())
  },
  test() {
    console.log("test")
  }
}
