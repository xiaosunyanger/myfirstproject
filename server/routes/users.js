var express = require('express');
var router = express.Router();
require('./../util/util')
var User=require("./../models/user");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//登录接口
router.post("/login", function (req,res,next) {
  var param = {
      userName:req.body.userName,
      userPwd:req.body.userPwd
  }
  User.findOne(param, function (err,doc) {
      if(err){
          res.json({
              status:"1",
              msg:err.message
          });
      }else{
          if(doc){
              res.cookie("userId",doc.userId,{
                  path:'/',
                  maxAge:1000*60*60
              });
              res.cookie("userName",doc.userName,{
                path:'/',
                maxAge:1000*60*60
              });
              //req.session.user = doc;
              res.json({
                  status:'0',
                  msg:'',
                  result:{
                      userName:doc.userName
                  }
              });
          }
      }
  });
});

//登出接口
router.post("/logout", function (req,res,next) {
    res.cookie("userId","",{
      path:"/",
      maxAge:-1
    });
    res.json({
      status:"0",
      msg:'',
      result:''
    })
  });
//校验接口
router.get("/checkLogin", function (req,res,next) {
    if(req.cookies.userId){
        res.json({
          status:'0',
          msg:'',
          result:req.cookies.userName || ''
        });
    }else{
      res.json({
        status:'1',
        msg:'未登录',
        result:''
      });
    }
  });


  //获取购物车列表接口
  router.get("/cartList", function (req,res,next) {
    let userId = req.cookies.userId;
    User.findOne({userId:userId}, function (err,doc) {
        if(err){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          });
        }else{
            if(doc){
              res.json({
                status:'0',
                msg:'',
                result:doc.cartList
              });
            }
        }
    });
  });

  //删除购物车商品接口
  router.post("/cartDel", function (req,res,next) {
    var userId = req.cookies.userId,productId = req.body.productId;
    User.update({
      userId:userId
    },{
      $pull:{
        'cartList':{
          'productId':productId
        }
      }
    }, function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        res.json({
          status:'0',
          msg:'',
          result:'suc'
        });
      }
    });
  });

  //商品数目加减接口
  router.post("/cartEdit", function (req,res,next)      {
        var userId = req.cookies.userId,
            productId = req.body.productId,
            productNum = req.body.productNum,
            checked = req.body.checked;
        User.update({"userId":userId,   "cartList.productId":productId},{
          "cartList.$.productNum":productNum,
          "cartList.$.checked":checked,
        }, function (err,doc) {
          if(err){
            res.json({
              status:'1',
              msg:err.message,
              result:''
            });
          }else{
            res.json({
              status:'0',
              msg:'',
              result:'suc'
            });
          }
        })
      });

  //购物车全选接口
  router.post("/cartCheckAll",(req,res,next)=>{
    var userId = req.cookies.userId,checkAll=req.checkAll;
    User.findOne({userId:userId},(err,user)=>{
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:"",
        })
      }else{
        if(user){
          user.cartList.forEach((item) => {
            item.checked=checkAll;
          });
          user.save((err1,doc)=>{
            if(err1){
              res.json({
                status:'1',
                msg:err.message,
                result:"",
              })
            }else{
              res.json({
                status:'0',
                msg:err.message,
                result:"suc",
              })
            }
          })
        }
      }
    })
  });


  
  //获取地址列表接口
  router.get('/addressLIst',(req,res,next)=>{
    var userId=req.cookies.userId;
    User.findOne({userId:userId},(err,doc)=>{
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:'',
        })
      }else{
        res.json({
          status:'0',
          msg:'',
          result:doc.addressList,
        })
      }
    })
  })

  //设置默认地址接口
  router.post("/setDefault",(req,res,next)=>{
    let userId=req.cookies.userId,addressId=req.body.addressId;
    if(!addressId){
      res.json({
        status:'1003',
        msg:'addressId没有传输过来',
        result:'',
      })
    }else{
      User.findOne({userId:userId},(err,doc)=>{
        if(err){
          res.json({
            status:'1',
            msg:'addressId没有传输过来',
            result:'',
          })
        }else{
          doc.addressList.forEach((item)=>{
            if(item.addressId==addressId){
              item.isDefault=true;
            }else{
              item.isDefault=false;
            }
          });
          doc.save((err1,doc)=>{
            if(err1){
              res.json({
                status:'1',
                msg:err1.message,
                result:'',
              })
            }else{
              res.json({
                status:'0',
                msg:err1.message,
                result:'',
              })
            }
          })
        }
      })
    }
  })

  //删除地址接口
  router.post("/delAddress", (req,res,next)=>{
    var userId = req.cookies.userId,addressId = req.body.addressId;
    User.update({
      userId:userId
    },{
      $pull:{
        'addressList':{
          'addressId':addressId
        }
      }
    }, function (err,doc) {
        if(err){
          res.json({
              status:'1',
              msg:err.message,
              result:''
          });
        }else{
          res.json({
            status:'0',
            msg:'',
            result:''
          });
        }
    });
  });
  
  //支付确认接口
  router.post("/payMent", function (req,res,next) {
    var userId = req.cookies.userId,
      addressId = req.body.addressId,
      orderTotal = req.body.orderTotal;
    User.findOne({userId:userId}, function (err,doc) {
       if(err){
          res.json({
              status:"1",
              msg:err.message,
              result:''
          });
       }else{
         var address = '',goodsList = [];
         //获取当前用户的地址信息
         doc.addressList.forEach((item)=>{
            if(addressId==item.addressId){
              address = item;
            }
         })
         //获取用户购物车的购买商品
         doc.cartList.filter((item)=>{
           if(item.checked=='1'){
             goodsList.push(item);
           }
         });
  
         var platform = '622';
         var r1 = Math.floor(Math.random()*10);
         var r2 = Math.floor(Math.random()*10);
  
         var sysDate = new Date().Format('yyyyMMddhhmmss');
         var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
         var orderId = platform+r1+sysDate+r2;
         var order = {
            orderId:orderId,
            orderTotal:orderTotal,
            addressInfo:address,
            goodsList:goodsList,
            orderStatus:'1',
            createDate:createDate
         };
  
         doc.orderList.push(order);
  
         doc.save(function (err1,doc1) {
            if(err1){
              res.json({
                status:"1",
                msg:err.message,
                result:''
              });
            }else{
              res.json({
                status:"0",
                msg:'',
                result:{
                  orderId:order.orderId,
                  orderTotal:order.orderTotal
                }
              });
            }
         });
       }
    })
  });

  //根据ID查询订单
  router.get("/orderDetail", function (req,res,next) {
    var userId = req.cookies.userId,orderId = req.param("orderId");
    User.findOne({userId:userId}, function (err,userInfo) {
        if(err){
            res.json({
               status:'1',
               msg:err.message,
               result:''
            });
        }else{
           var orderList = userInfo.orderList;
           if(orderList.length>0){
             var orderTotal = 0;
             orderList.forEach((item)=>{
                if(item.orderId == orderId){
                  orderTotal = item.orderTotal;
                }
             });
             if(orderTotal>0){
               res.json({
                 status:'0',
                 msg:'',
                 result:{
                   orderId:orderId,
                   orderTotal:orderTotal
                 }
               })
             }else{
               res.json({
                 status:'120002',
                 msg:'无此订单',
                 result:''
               });
             }
           }else{
             res.json({
               status:'120001',
               msg:'当前用户未创建订单',
               result:''
             });
           }
        }
    })
  });
module.exports = router;
