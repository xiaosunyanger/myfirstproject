// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import Vuex from 'vuex'
var infiniteScroll = require('vue-infinite-scroll');
Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.use(infiniteScroll)
Vue.use(Vuex);
Vue.use(VueLazyLoad,{
  loading:"./../static/loading-svg/loading-balls.svg"
})
const store = new Vuex.Store({
  state: {
    nickName:'',
    cartCount:0
  },
  mutations: {
    //更新用户信息
    updateUserInfo(state, nickName) {
      state.nickName = nickName;
    },
    updateCartCount(state,count){
      state.cartCount = count;
    }
  }
});
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
