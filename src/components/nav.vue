<template>
    <div class="nav">
      <div class="navWrap">
        <ul>
          <li class="menu-logo">
            <span class="menu-icon"><img style="margin-top:11px;" src='../assets/img/index_logo.png'/></span>
            <!-- <span class="menu-text">{{$t("message.Nav_log")}}</span> -->
            <router-link class="menu-text" to="/person">{{$t("message.Nav_log")}}</router-link>
          </li>
          <li class="menu-account" style="margin-left:100px;" v-if="IsLogin" @click="toIndex()">
            <!-- <span class="menu-icon"><img style="margin-top: 31px;" src='../assets/images/images/account.png'/></span> -->
            <span class="menu-text">我的账户</span>
          </li>
          <!-- <li class="menu-asch" style="margin-left:80px;">
            <a :href="Link" target="blank">
              <span class="menu-icon"><img style="margin-top: 33px;" src='../assets/images/images/asch.png'/></span>
              <span class="menu-text">阿希钱包</span>
            </a>
            
          </li> -->
          <!-- <li class="menu-github" style="margin-left:80px;">
            <a href="https://github.com/DreamworldDapp/DDC-Wallet-Front" title="github of DDC-Wallent-Front" target="blank" >
              <span class="menu-icon"><img style="margin-top: 30px;" src='../assets/images/images/github.png'/></span>
              <span class="menu-text">GitHub</span>
            </a>
          </li> -->
          <li class="menu-github" style="margin-left:80px;">
            <a href="http://3udao.com/" title="3U" target="__blank" >
              <span class="menu-text">3U官网</span>
            </a>
          </li>
          <li class="menu-languge menu-right" style="margin-left:60px;" v-if="IsLogin" @click="logout()" >
            <i class="menu-icon logout"></i>
            <span class="menu-text">{{$t("message.NavLogOut")}}</span>
          </li>
          <!-- <li class="menu-login menu-right">
            <span class="menu-icon"><img style="margin-top: 30px;" src='../assets/images/images/语言.png'/></span>
            <span class="menu-text">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  {{LanguageM}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">中文</el-dropdown-item>
                  <el-dropdown-item command="b">English</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </li> -->
        </ul>
      </div>
    </div>
</template>
<script>
import Config from "../config/server";
export default {
  name: "NavBar",
  data() {
    return {
      activeIndex: "2",
      activeIndex2: "",
      Languge: "CN",
      Link: Config.baseUrl,
      LanguageM:"中文"
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    logout() {
      console.log("logout");
      this.$store.dispatch("logout");
    },
    toIndex(){
      this.$router.replace("/person")
    },
    handleCommand(command){
      if(command=="a"){
        this.$i18n.locale = 'CN';
        this.LanguageM="中文"
      }else{
         this.$i18n.locale = 'EN';
         this.LanguageM="English"
      }
    },
  },
  mounted() {
    var path = this.$route.path.toLocaleLowerCase();
    if (!path || path == "/") {
      this.activeIndex2 = "3";
      return false;
    }
    if (path.indexOf("person") >= 0) {
      this.activeIndex2 = "6";
      return false;
    }
    if (path.indexOf("kongtou") >= 0) {
      this.activeIndex2 = "5";
      return false;
    }
  },
  watch: {
    Languge(value) {
      console.log(value);
      this.$i18n.locale = value;
    },

    $route(value) {
      var path = value.path.toLocaleLowerCase();
      console.log(path);
      if (path == "\\") {
        this.activeIndex2 = "3";
        return false;
      }
      if (path.indexOf("person") >= 0) {
        this.activeIndex2 = "6";
        return false;
      }
      if (path.indexOf("kongtou") >= 0) {
        this.activeIndex2 = "5";
        return false;
      }
    }
  },
  computed: {
    IsLogin() {
      var user = this.$store.state.user;
      if (user) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>
<style>
.nav{
  /* height: 80px; */
  overflow: hidden;
  background: #ffffff;
  color:#282828;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);
}
.navWrap{
  /* height: 80px; */
  max-width: 1180px; 
  margin:0 auto;
}
.navWrap ul{
  height: 100%;
  list-style: none;
}
.navWrap>ul>li{
  height: 100%;
  color: #282828;
  /* line-height: 70px; */
  float: left;
  cursor: pointer;
  transition: all .5s ease-in-out;
}
.navWrap>ul>li>a{
  display: block;
  height: 70px;
  line-height: 80px;

}
.navWrap>ul>li:hover span{
  color: #57c586;
}
.navWrap ul>li .menu-text{
  display: inline-block;
  padding-left: 8px;
  line-height: 70px;
}
.navWrap ul>li .menu-text:hover{
  color: #57c586;
}
.navWrap>ul>li span{
  float: left;
  height: 70px;
  line-height: 70px;
  transition:color .1s ease-in-out;
}
.navWrap .menu-logo{
  font-size: 24px;
}
.navWrap .menu-right{
  float: right;
}
.navWrap .menu-languge{
  margin-left:60px;
}
.navWrap .menu-login{
  margin-left: 30px;
}
.menu-asch .menu-text,
.menu-github .menu-text{
  color: #656565;
}
.navWrap .menu-logo .menu-icon{
  position: relative;
}
.logout{
  font-style: normal;
  /* display: inline-block; */
  float: left;
  width: 22px;
  height: 22px;
  margin-top: 24px;
  background: url('../assets/img/logout.png') no-repeat 0px center;
}
.menu-right:hover .logout{
  background-position: -24px center;
  color: #6ddc9c;
}
@media screen and (max-width:768px ){

    .menu-logo,
    .menu-account,
    .menu-login,
    .menu-github,
    .menu-languge,
    .menu-asch{
      margin-left: 10px !important;
      display: block;
      width: 100%;
      min-width: 300px;
    }
    .menu-right{
      float: left !important;
    }
    .nav-menu{
      overflow: hidden;
    }
    .navWrap{
      /* height: 80px; */
    max-width: 768px; 
    }
}
</style>
