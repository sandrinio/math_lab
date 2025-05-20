export default {
  namespaced: true,
  state: () => ({
    assignments: []
  }),
  mutations: {
    setAssignments(state, assignments) {
      state.assignments = assignments
    },
    addAssignment(state, assignment) {
      state.assignments.push(assignment)
    }
  },
  actions: {
    updateAssignments({ commit }, assignments) {
      commit('setAssignments', assignments)
    },
    addAssignment({ commit }, assignment) {
      commit('addAssignment', assignment)
    }
  },
  getters: {
    allAssignments: state => state.assignments
  }
}
