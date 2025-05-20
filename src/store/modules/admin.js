export default {
  namespaced: true,
  state: () => ({
    adminList: [],
    isSuperAdmin: false
  }),
  mutations: {
    setAdminList(state, admins) {
      state.adminList = admins
    },
    setSuperAdmin(state, isSuper) {
      state.isSuperAdmin = isSuper
    }
  },
  actions: {
    updateAdminList({ commit }, admins) {
      commit('setAdminList', admins)
    },
    updateSuperAdmin({ commit }, isSuper) {
      commit('setSuperAdmin', isSuper)
    }
  },
  getters: {
    allAdmins: state => state.adminList,
    isSuperAdmin: state => state.isSuperAdmin
  }
}
