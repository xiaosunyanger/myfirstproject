<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span>orderSuccess</span>
        </nav-bread>
     <div>
        <div class="container">
            <div class="page-title-normal">
            <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
    <!-- 进度条 -->
    <div class="check-step">
      <ul>
        <li class="cur">
            <span>确认地址</span> 
        </li>
        <li class="cur">
            <span>查看订单</span> 
        </li>
        <li class="cur">
            <span>支付</span> 
        </li>
        <li class="cur">
            <span>支付确认</span> 
        </li>
      </ul>
    </div>

    <div class="order-create">
      <div class="order-create-pic">
          <img src="./../../static/ok-2.png" alt="">
      </div>
      <div class="order-create-main">
        <h3>恭喜你 
         <br>订单已完成</h3>
        <p>
          <span>订单号：{{orderId}}</span>
          <span>订单总价：{{orderTotal}}</span>
        </p>
            <div class="order-create-btn-wrap">
                <div class="btn-l-wrap">
                   <router-link to='/cart' class="btn btn--m">返回购物车</router-link>
                </div>
                <div class="btn-r-wrap">
                    <router-link to='/' class="btn btn--m">返回商品列表</router-link>
                </div>
            </div>
          </div>
         </div>
        </div>
       </div>
      <nav-footer></nav-footer>
    </div>
</template>
<script>
import NavHeader from   '@/components/NavHeader'
import NavFooter from   '@/components/NavFooter'
import NavBread from   '@/components/NavBread'
import Modal from   '@/components/Modal'
import axios from 'axios'
export default {
 components:{
        NavHeader,
        NavFooter,
        NavBread,
        Modal,
    },
    data(){
        return{
            orderId:'',
            orderTotal:0,
        }
    },
    mounted(){
        var orderId=this.$route.query.orderId;
        if(!orderId){
            return;
        }
        axios.get('/users/orderDetail',{
          params:{ orderId:orderId,}
        }).then((response)=>{
            let res=response.data;
            if(res.status=='0'){
                this.orderTotal=res.result.orderTotal;
                this.orderId=res.result.orderId;
            }else{
                console.log('无此订单')
            }
        })
    },

}
</script>
<style scoped>

</style>
