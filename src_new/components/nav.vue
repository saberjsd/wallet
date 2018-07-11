<template>
    <div class="nav">
		<div class="line"></div>
			<el-row style="background: rgb(84, 92, 100)">
				<el-col :span="20" :offset="2">
					<el-menu
  				:default-active="activeIndex2"
  				class="el-menu-demo"
  				mode="horizontal"
  				@select="handleSelect"
  				background-color="#545c64"
  				text-color="#fff"
  				active-text-color="#ffd04b">

   				<el-menu-item v-show="IsLogin" index="6">
    				<router-link to="/person">{{$t("message.NavPerson")}}</router-link>  
    			</el-menu-item>
        		<!-- <el-menu-item  index="5" >
        			<router-link to="/kongtou">{{$t("message.NavDapp")}}</router-link>
    			</el-menu-item> -->
				
    			<el-menu-item v-if="!IsLogin" index="3" style="float:right">
        			<router-link to="/">{{$t("message.NavLogin")}}</router-link>
    			</el-menu-item>
    			<el-menu-item v-else index="4"   style="float:right">
            <span @click="logout()">{{$t("message.NavLogOut")}}</span>
          </el-menu-item>
				  <el-menu-item index="2" style="float:right">
        			<template>
            			<el-select v-model="Languge" placeholder="请选择" style="width:110px">
                			<el-option value="EN" label="English" ></el-option>
                			<el-option value="CN" label="中文简体"></el-option>
            			</el-select>
        			</template>
    			</el-menu-item>
				<el-menu-item index="7" style="float:right">
					<a :href="Link" target="blank" ><i class="el-icon-arrow-right"></i>{{$t("message.Login_AschLink")}}</a>
					</el-menu-item>
    				</el-menu>
				<div class="LOGO" style="" > {{$t("message.Nav_log")}}</div>	
				</el-col>
			</el-row>
		
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
      Link: Config.baseUrl
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    logout() {
      window.localStorage.removeItem("user");
      console.log("logout");
      this.$store.dispatch("logout");
    }
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
.right {
  float: right;
  position: relative;
  top: -40px;
  right: 40px;
  color: rgb(255, 255, 255);
  border-bottom-color: transparent;
  background-color: rgb(84, 92, 100);
}
.nav {
  position: relative;
  min-width: 1200px;
}
.Head {
  height: 60px;
  position: absolute;
  width: 100%;
  margin: 0 auto;
  z-index: 100;
  top: 0px;
}
.LOGO {
  font-size: 40px;
  width: 400px;
  text-align: right;
  color: white;
  position: absolute;
  height: 60px;
  line-height: 60px;
  width: 250px;
  top: 0px;
  left: calc(50% - 130px);
}
.nav .el-menu--horizontal .el-menu-item a,
.nav .el-menu--horizontal .el-menu-item a:hover {
  color: inherit;
  height: 60px;
  display: inline-block;
}
.nav .el-menu-item,
.el-submenu__title {
  padding: 0px;
}
.nav .el-menu-item > * {
  padding: 0 20px;
}
</style>
