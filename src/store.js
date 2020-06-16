import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    transitionName:''
  },
  mutations: {
    transitionName(a,b){
      console.log(a,b)
    },

  },
  actions: {

  }
})
