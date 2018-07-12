<template>
    <div>
      <NavBar></NavBar>
      <div class="person">
        <div class="main">
          <transition name="fold">
            <router-view></router-view>
          </transition>
        </div>
    </div>
    </div>
    
</template>
<script>
import NavBar from "../../components/nav" 
export default {  
  components:{
    NavBar
  },
  data() {
    return {};
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      var user = vm.$store.state.user;
      if (!user) {
        console.log("vm", vm);
        vm.$router.replace("/");
      }
    });
  },
  watch:{
      "IsLogin"(value){
          if(!value){
              this.$router.replace("/");
          } 
      }
  },
  computed:{
    IsLogin(){
            var user=this.$store.state.user;
            if(user){
                return true;
            }else{
                return false;
            }
            
        }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style>
.person{
  max-width: 1180px;
  margin: 0 auto;
}
.wrap {
  padding: 10px;
}
.left{
    width: 130px;
    float: left;
}
.main{
    /* margin-left:160px; */
}
a:active,a:link,a:visited {
  color:#303133;
}
i.el-icon-menu{
  color: #909399
}
@media screen and (max-width:768px ){
  .person{
    max-width: 748px;
    padding: 10px;
  }
    
}
</style>
