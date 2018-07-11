<template>
    <div class="person">
      <el-row>
        <el-col :span="22" :offset="2">
    <div class="left">
      
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      >
      <!-- <el-menu-item index="1">
        <i class="el-icon-menu"></i>
        <span slot="title">
            <router-link to="/person">{{$t("message.PerSonNav_Personal_Message")}}
            </router-link>
            </span>
      </el-menu-item> -->
      <el-menu-item index="1">
        <i class="el-icon-menu"></i>
        <span slot="title">
            <router-link to="/person">
            {{$t("message.PerSonNav_Personal_Account")}}
            </router-link>
        </span>
      </el-menu-item>
      <!-- <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">
            <router-link to="/person/kongtou">
            {{$t("message.PersonNav_KongTou")}}
            </router-link>
        </span>
      </el-menu-item> -->
       <el-menu-item index="3">
        <i class="el-icon-menu"></i>
        <span slot="title">
            <router-link to="/person/auction">
            地块竞拍
            <!-- {{$t("message.PerSonNav_Personal_Account")}}  -->
            </router-link>
        </span>
      </el-menu-item> 
      <el-menu-item index="4"> 
         <i class="el-icon-menu"></i>
        <span slot="title">
            <router-link to="/person/joins">
            操作记录
            <!-- {{$t("message.PerSonNav_Personal_Account")}}  -->
            </router-link>
        </span>
      </el-menu-item>
      <el-menu-item index="5"> 
        <i class="el-icon-menu"></i>
        <span slot="title">
            <router-link to="/person/lands">
            我的地块
            <!-- {{$t("message.PerSonNav_Personal_Account")}}  -->
            </router-link>
        </span>
      </el-menu-item>
      <!-- <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">
            <router-link to="/person/uia">
            资产转账
             {{$t("message.PerSonNav_Personal_Account")}}
            </router-link>
        </span>
      </el-menu-item>  -->
    </el-menu>
  </div>
        <div class="main">
              <transition name="fold">
            <router-view></router-view>
              </transition>
        </div>
          </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      var user = vm.$store.state.user;
      if (!user) {
        var window_user = window.localStorage.getItem("user");
        if (window_user.length > 0) {
          user = JSON.parse(window_user);
          if (user) {
            vm.$store.dispatch("setUser", user);
          } else {
            console.log("vm", vm);
            vm.$router.replace("/");
          }
        } else {
          console.log("vm", vm);
          vm.$router.replace("/");
        }
      }
    });
  },
  watch: {
    IsLogin(value) {
      if (!value) {
        this.$router.replace("/");
      }
    }
  },
  mounted() {
    var user = this.$store.state.user;
    if (!user) {
      var window_user = window.localStorage.getItem("user");
      if (window_user.length > 0) {
        user = JSON.parse(window_user);
        if (user) {
          this.$store.dispatch("setUser", user);
        }
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
.person {
  min-width: 1200px;
}
.wrap {
  padding: 10px;
}
.left {
  width: 130px;
  float: left;
}
.main {
  margin-left: 160px;
}
</style>
