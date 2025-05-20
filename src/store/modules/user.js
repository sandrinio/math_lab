import { authService } from '../../services/auth'

export default {
  namespaced: true,
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setLoading(state, loading) {
      state.loading = loading
    },
    setError(state, error) {
      state.error = error
    },
    clearError(state) {
      state.error = null
    }
  },
  actions: {
    async initializeAuth({ commit }) {
      const user = authService.getCurrentUser()
      if (user) {
        commit('setUser', user)
      }
    },
    async login({ commit }, { identifier, password }) {
      commit('setLoading', true)
      commit('clearError')

      try {
        const { success, user, error } = await authService.login(identifier, password)
        
        if (!success) throw new Error(error)
        
        commit('setUser', user)
        return { success: true, userType: user.type }
      } catch (error) {
        commit('setError', error.message)
        return { success: false, error: error.message }
      } finally {
        commit('setLoading', false)
      }
    },
    async logout({ commit }) {
      commit('setLoading', true)
      commit('clearError')

      try {
        const { success } = await authService.logout()
        if (!success) throw new Error('Logout failed')
        commit('setUser', null)
        return { success: true }
      } catch (error) {
        commit('setError', error.message)
        return { success: false, error: error.message }
      } finally {
        commit('setLoading', false)
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.user,
    isParent: state => state.user?.type === 'parent',
    isAdmin: state => state.user?.type === 'admin',
    isChild: state => state.user?.type === 'child',
    userType: state => state.user?.type,
    userName: state => state.user?.name,
    userEmail: state => state.user?.email,
    isLoading: state => state.loading,
    error: state => state.error
  }
}
