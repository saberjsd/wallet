import Vue from 'vue'
import Router from 'vue-router'
var LoginView = ()=> import( "@/views/login")
var PersonWrapper = ()=> import("@/views/home/person")
var PersonAccount = ()=> import("@/views/home/person/account")
var PersonTrans = ()=> import("@/views/home/person/transcation")
var PersonKongTou = ()=> import("@/views/home/person/kontou_test")
var PersonKongTouInfo = ()=> import("@/views/home/person/kongtouinfo")
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      name: 'Login',
      component: LoginView
    },
    {
      path:"/KongTou",
       name:"KongTou",
       component:PersonKongTou
    },{
      path:"/kongtouinfo",
      name:"KongTouInfo",
      component:PersonKongTouInfo
    },
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
        {
          path: "trans",
          name: "Trans",
          component: PersonTrans
         },
      ]
    },
  ]
})
