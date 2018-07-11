<template>
  <!--<div id="allmap" style="width: 100%; height: {{mapHeight}}px"></div>-->
  <!--<div id="allmap":style="{width: '100%', height: mapHeight + 'px'}"></div>-->
  <div class="BMap">
      <div class="Map_left" :style="'height:'+height+'px'" >
	<router-view></router-view>
      </div>
      <div class="Map_Right">
            <div id="allmap" v-bind:style="mapStyle"></div>
      </div>

  </div>
  
</template>
<script>
export default {
  data: function() {
    var height = this.getClientHeight();
    return {
      height: height,
      mapStyle: {
        width: "100%",
        height: height - 81 + "px"
      },
      activeName: "",
      map: null,
      longitude: 116.404,
      latitude: 39.915,
      description: "天安门"
    };
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
    this.init();
    var height = this.getClientHeight();
    this.height = height - 81;
    this.mapStyle = {
      width: "100%",
      height: height - 81 + "px"
    };
    var path = this.$route.path;
    if (path.indexOf("Land") > 0) {
      this.activeName = "Land";
    } else if (path.indexOf("Area") > 0) {
      this.activeName = "Area";
    }
  },
  watch: {
    activeName() {
      this.$store.dispatch("setActive", this.activeName);
    }
  },
  methods: {
    handleClick(tab, event) {
      return false;
      //console.log(tab, event);
      this.$router.push({ name: this.activeName });
    },
    init() {
      //   var map = new BMap.Map("allmap", { enableMapClick: false });
      //   map.setDefaultCursor("default");
      //   var point = new BMap.Point(this.longitude, this.latitude);
      //   map.centerAndZoom(point, 15);
      //   this.map = map;
    },
    getClientHeight() {
      var clientHeight = 0;
      if (document.body.clientHeight && document.documentElement.clientHeight) {
        var clientHeight =
          document.body.clientHeight < document.documentElement.clientHeight
            ? document.body.clientHeight
            : document.documentElement.clientHeight;
      } else {
        var clientHeight =
          document.body.clientHeight > document.documentElement.clientHeight
            ? document.body.clientHeight
            : document.documentElement.clientHeight;
      }
      return clientHeight;
    }
  }
};
</script>
 
<!--Add"scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  transition: all 0.2s;
}
.BMap {
  position: relative;
  margin: 0 auto;
  padding: 10px;
}
.Map_left {
  position: absolute;
  width: 320px;
  height: 500px;
  background: #e5e5e5;
  overflow-y: scroll;
  padding: 0px 10px;
  padding-top: 10px;
}
.Map_Right {
  margin-left: 330px;
}
.PayLoadItem,
.item {
  padding: 5px;
  cursor: pointer;
}
.PayLoadItem:hover,
.item:hover {
  color: white;
  background: #409eff;
}
.item:hover button {
  color: white;
}
</style>