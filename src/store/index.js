import { createStore } from 'vuex'
import user from './modules/user'
import admin from './modules/admin'
import homework from './modules/homework'

const store = createStore({
  modules: {
    user,
    admin,
    homework
  }
})

export default store
