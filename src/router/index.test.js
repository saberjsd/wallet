//import Vue from 'vue'
//import Router from 'vue-router'
//var LoginView = ()=> import( "@/views/login")
//var PersonWrapper = ()=> import("@/views/home/person")
//var PersonAccount = ()=> import("@/views/home/person/account")
//var PersonTrans = ()=> import("@/views/home/person/transcation")
//var PersonKongTou = ()=> import("@/views/home/person/kontou_test")
//var PersonKongTouInfo = ()=> import("@/views/home/person/kongtouinfo")
//Vue.use(Router)
import LoginView from '@/views/login';
import PersonWrapper from "@/views/home/person"
import PersonAccount from  "@/views/home/person/account"
import PersonTrans from "@/views/home/person/transcation"
import UiaTrans from "@/views/home/person/transcation_uia"

export default new VueRouter({
  routes: [
    {
      path: "/",
      name: 'Login',
      component: LoginView
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
         },{
           path:"uiaTrans",
           name:"uiaTrans",
           component:UiaTrans
         }
      ]
    },
  ]
})
