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
                <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short" v-bind:class="{'sortup':!sortFlag}"><use xlink:href="#icon-arrow-short"></use></svg></a>
                <a href="javascript:void(0)" class="filterby stopPop" @click='filterpop'>Filter by</a>
              </div>
              <div class="accessory-result">
                <!-- filter -->
                <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}" >
                  <dl class="filter-price">
                    <dt>Price:</dt>
                    <dd><a href="javascript:void(0)" v-bind:class="{'cur':pricechecked=='all'}" @click="setpricefilter('all')">All</a></dd>
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
                          <!-- 图片里用了懒加载 -->
                          <a href="#"><img v-lazy="'static/'+item.productImage" alt=""></a>
                        </div>
                        <div class="main">
                          <div class="name">{{item.productName}}</div>
                          <div class="price" style="text-align: center; width: 100%">{{item.salePrice}}</div>
                          <div class="btn-area">
                            <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <!-- 无限滚动插件-->
                    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="loade-more">
                     <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
                      </div>  
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
import { setTimeout } from 'timers';
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
            startPrice:0,
            endPrice:100,
          },
          {
            startPrice:100,
            endPrice:500,
          },
          {
            startPrice:500,
            endPrice:1000,
          },
           {
            startPrice:1000,
            endPrice:5000,
          }
        ],
        pricechecked:'all',
        filterBy:false,
        overLay:false,
        sortFlag:true,//定义sortFlag是为了点击时传给后台的参数sort能实时变化
        page:1,
        pageSize:8,
        busy:true,//控制无限滚动插件默认不禁用
        loading:false,
      }
    },
    mounted(){
      this.getGoodsList();
    },
    methods: {
      //因为在滚动下滑时也需要获取商品数据，商品数据是累加进去，而页面刚加载和价格升序降序时获取商品信息都是一次性获取，无需累加，传入flag时为了区分在何时获取数据。
      getGoodsList(flag){
        var param = {
            page:this.page,
            pageSize:this.pageSize,
            sort:this.sortFlag?1:-1,
            priceLevel:this.pricechecked
        };
        this.loading=true;
        axios.get("/goods/list",{
            params:param,
          }).then((response)=>{
          var res=response.data;
          this.loading=false;
          if(res.status=='0'){
          if(flag){
                this.GoodsList = this.GoodsList.concat(res.result.list);//在商品分页时商品列表需要累加
                if(res.result.count==0){
                    this.busy = true;
                  }else{
                    this.busy = false;
                  }
                }else{
                  this.GoodsList = res.result.list;
                  this.busy = false;
                }
          }else{
             this.GoodsList=[];
          }
        })
      },
      setpricefilter(index){
        this.pricechecked=index;
        this.closePop();
        this.getGoodsList();
        this.page=1;
      },//实现价格过滤并且使得被选中的价格区间颜色变成选中状态
      filterpop(){
        this.filterBy=true;
        this.overLay=true;
      },
      closePop(){
        this.filterBy=false;
        this.overLay=false;
      },
      sortGoods(){
        this.sortFlag=!this.sortFlag;
        this.page=1;
        this.getGoodsList();//将排序信息传给后台后，后台对商品重排序后前端进行重新加载数据
      },
      loadMore(){
         this.busy = true;//在数据获取到前，取消滚动加载
         setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
        }, 300);
      },
      addCart(productId){
        axios.post("/goods/addcart",{
          productId:productId,
        }).then((response)=>{
          var res=response.data;
          if(res.status=='0'){
            alert("加入成功")
          }else{
            alert(msg)
          }
        })
      },
    },
}
</script>
<style>
.sortup{
  transform: rotate(180deg);
  transition: all .6s ease-out;
}
.icon-arrow-short{
   transition: all .6s ease-out;
}
.btn:hover{
  background-color: #ffe5e6;
  transition: all .3s ease-out;
}
</style>