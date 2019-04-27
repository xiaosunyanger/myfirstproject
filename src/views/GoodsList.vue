<template>
    <div>
          <nav-header></nav-header>
          <nav-bread>
            <span>Goods</span>
          </nav-bread>
          <div class="accessory-result-page accessory-page">
            <div class="container">
              <div class="filter-nav">
                <span class="sortby">Sort by:</span>
                <a href="javascript:void(0)" class="default cur">Default</a>
                <a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
                <a href="javascript:void(0)" class="filterby stopPop" @click='filterpop'>Filter by</a>
              </div>
              <div class="accessory-result">
                <!-- filter -->
                <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}" >
                  <dl class="filter-price">
                    <dt>Price:</dt>
                    <dd><a href="javascript:void(0)" v-bind:class="{'cur':pricechecked=='all'}" >All</a></dd>
                    <dd v-for='(item,index) in PriceFilter'>
                      <a href="javascript:void(0)" v-bind:class="{'cur':pricechecked==index}" @click="setpricefilter(index)">{{item.startPrice}}-{{item.endPrice}}</a>
                    </dd>
                  </dl>
                </div>
        
                <!-- search result accessories list -->
                <div class="accessory-list-wrap">
                  <div class="accessory-list col-4">
                    <ul>
                      <li v-for='item in GoodsList'>
                        <div class="pic">
                          <a href="#"><img v-lazy="'/static/'+item.productImg" alt=""></a>
                        </div>
                        <div class="main">
                          <div class="name">{{item.productname}}</div>
                          <div class="price" style=" text-align: center; width: 100%">{{item.productPrice}}</div>
                          <div class="btn-area">
                            <a href="javascript:;" class="btn btn--m">加入购物车</a>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="md-overlay" v-show="overLay" @click="closePop"></div>
          <nav-footer></nav-footer>
      </div>
</template>
<script>
import '@/assets/css/base.css'
import '@/assets/css/product.css' 
import NavHeader from   '@/components/NavHeader'
import NavFooter from   '@/components/NavFooter'
import NavBread from   '@/components/NavBread'
import axios from 'axios'
export default {
    components:{
        NavHeader,
        NavFooter,
        NavBread
    },
    data(){
      return{
        GoodsList:[],
        PriceFilter:[
          {
            startPrice:50,
            endPrice:100,
          },
          {
            startPrice:100,
            endPrice:500,
          },
          {
            startPrice:500,
            endPrice:1000,
          }
        ],
        pricechecked:'all',
        filterBy:false,
        overLay:false,
      }
      
    },
    mounted(){
      this.getGoods();
    },
    methods: {
      getGoods(){
        axios({
          method:'get',
          url:'/api/appData'
        }).then((result)=>{
          var res=result.data;
          this.GoodsList=res.data.result;
         
        })
      },
      setpricefilter(index){
        this.pricechecked=index;
        this.closePop();
      },
      filterpop(){
        this.filterBy=true;
        this.overLay=true;
      },
      closePop(){
        this.filterBy=false;
        this.overLay=false;
      }
    },
}
</script>
<style scoped></style>