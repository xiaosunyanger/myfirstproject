import Vue from 'vue'
import Router from 'vue-router'
import Cart from '@/views/Cart'
import GoodsList from '@/views/GoodsList'
import  Address from '@/views/Address'
import orderConfirm from '@/views/orderConfirm'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart,
    },
    {
      path: '/address',
      name: 'Address',
      component: Address,
    },
    {
      path:'/orderConfirm',
      name:'orderConfirm',
      component:orderConfirm,
    }
  ]
})
