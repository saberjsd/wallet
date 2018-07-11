import Vue from 'vue'
import Router from 'vue-router'
var LoginView = ()=> import( "@/views/login")
//import IndexView from "@/views/home/index.vue"
var PersonWrapper = ()=> import("@/views/home/person")
//import PersonMessage = ()=> import"@/views/home/person/person_message")
var PersonAccount = ()=> import("@/views/home/person/account")
var PersonTrans = ()=> import("@/views/home/person/transcation")
//import PersonKongTou from "@/views/home/person/kongtou")
// var PersonKongTou = ()=> import("@/views/home/person/kongtou")
// //var PersonKongTou = ()=> import("@/views/home/person/kontou_test")
// var PersonKongTouInfo = ()=> import("@/views/home/person/kongtouinfo")
var PersonAuction = ()=> import("@/views/home/person/auction2")

//import PersonUia from "@/views/home/person/transcation_uia"
//import Test from "@/views/home/test"
 import PersonBMap from "@/views/home/person/BMap"
 import BMapArea from "@/views/home/person/BMap_Area"
 import BMapLand from "@/views/home/person/BMap_Land"
//import ZhuanZhangView2 from "@/views/home/listPush2"
//import ZhuanZhangView from "@/views/home/listPush3"
import logs from "@/views/home/person/logTest"
Vue.use(Router)

const route= new Router({
  mode:"history",
  routes: [
    {
      path: "/",
      name: 'Login',
      component: LoginView
    },
    // {
    //   path:"/test",
    //   name:"test",
    //   component:Test
    // },
    {
      path: "/BMap",
      name: "BMap",
      component: PersonBMap,
      children: [
        { name:"Land",path: "Land", component: BMapLand ,props: true},
        {name:"Area",
          path: "Area",component: BMapArea ,props: true
        }
      ]
    },
    // {
    //   path:"/zhuangzhangidlude",
    //   name:'ListPush',
    //   component:ZhuanZhangView
    // },
    // {
    //   path:"/zhuangzhangidlude",
    //   name:'ListPush2',
    //   component:ZhuanZhangView2
    // },
    // {
    //   path:"/KongTou",
    //    name:"KongTou",
    //    component:PersonKongTou
    // },{
    //   path:"/kongtouinfo",
    //   name:"KongTouInfo",
    //   component:PersonKongTouInfo
    // },
    // {
    //   path:"/log_contract_test",
    //   name:'Logs',
    //   component:logs
    // },
    {
      path: "/person",
      name: 'Person',
      component: PersonWrapper,
      children: [
        {
          path: "",
          name: 'accountview',
          component: PersonAccount
        },

        // ,{
        //   path:"zhuangzhangidlude",
        //   name:'ListPush3',
        //   component:ZhuanZhangView
        // }
        {
          path: "trans",
          name: "Trans",
          component: PersonTrans
         }
         ,{
          path:"joins",
          name:"Joins",
          component:()=>{return import("@/views/home/person/auctionlog")}
         },{
          path:"lands",
          name:"Lands",
          component:()=>{return import("@/views/home/person/myland")}
         },

        {
          path:"auction",
          name:"Auction",
          component:PersonAuction
        },{
          path:"auctions/:id",
          name:"AuctionDetail",
          component:()=>import("@/views/home/person/auctionDetail")
        },{
          path:"map",
          name:"Map",
          component:()=>import("@/views/home/person/total")
        },{
          path:"areas/:name",
          name:"areaAuction",
          component:()=>import("@/views/home/person/auction_area")
        }
        //  {
        //    path:"uia",
        //    name:"Uia",
        //    component:PersonUia
        //  }
      ]
    },
  ]
})
route.beforeEach((to,from,next)=>{
  next(vm=>{
    var user = vm.$store.state.user;
      if (!user) {
        var window_user=window.localStorage.getItem("user");
        if(window_user.length>0){
          var user=JSON.parse(window_user);
          if(user){
            vm.$store.dispatch("setUser", user);
          }
        }
      }
  })
})
export default route;
