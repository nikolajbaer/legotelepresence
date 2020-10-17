import Vue from 'vue'
import Vuex from 'vuex'
import BoostController from './boost_control'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    boost: null
  },
  getters: {
    boost: state => {
      return state.boost
    }
  },
  mutations: {
    set_boost (state, boost) {
      state.boost = boost
    },
    create_boost (state) {
      state.boost = new BoostController()
    },
  }
})