// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
var infiniteScroll = require('vue-infinite-scroll');
Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.use(infiniteScroll)
Vue.use(VueLazyLoad,{
  loading:"./../static/loading-svg/loading-balls.svg"
})
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
