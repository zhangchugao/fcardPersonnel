import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'
Vue.use(Vuex)
const store = {
  state: {
    transitionName: '',
    language: 'zh', //设置语言·
    recruitScrollY: 0, // 保存门禁主页滚动条的位置
  },
  getters:{
    recruitScrollY: state => state.recruitScrollY,
    language: state => state.language
  }
}

export default new Vuex.Store({
  state: {
    transitionName: '',
    language: 'zh', //设置语言·
    recruitScrollY: 0, // 保存门禁主页滚动条的位置
  },
  mutations: {
    transitionName(a, b) {
      console.log('a, b')
      console.log(a, b)
    },
    SET_LANGUAGE: (state, language) => { //设置语言·
      state.language = language
      // console.log('#$%^$#^%$&^%&多语言')
      Cookies.set('language', language)
    },
    changeRecruitScrollY(state, recruitScrollY) { // 改变存储的滚动高度
      state.recruitScrollY = recruitScrollY
    }
  },
  actions: {
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
  },
  getters: {
    recruitScrollY: state => state.recruitScrollY,
    language: state => state.language
  }
})

// export default store;
