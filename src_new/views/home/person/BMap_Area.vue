<template>
    <div class="left_area">
          <div class="overLayList">
                <el-button size="mini" type="warning" @click="Clear(true)">清空</el-button>
                <el-button size="mini" type="primary" @click="Edite()">{{EditeText}}</el-button>
                <el-button v-if="!PayLoadEdite" size="mini" :loading="loading" type="primary" @click="Add()">添加</el-button>
                <el-button v-else size="mini" type="primary" @click.prevent="Save()">保存</el-button>
                <br/>
                <label>地址</label>
                <el-input v-model="form_address" placeholder="区块地址"/>
                <label>名字</label>
                <el-input v-model="form_name" placeholder="区块名"/>
                <transition-group name="el-fade-in-linear">
                    <div class="item" v-for="(item,index) in OverlayList" :key="index" >
                        <p style="font-size:12px">{{item.lng}}-{{item.lat}} <el-button size="mini" type="warning"  @click.prevent="Remove(index)">删除</el-button></p>
                        
                    </div>
                </transition-group>

          </div>
          <div class="PayLoadList">
              <transition-group name="el-fade-in-linear">
              <div class="PayLoadItem" v-for="(item,index) in PayLoadList" @click="Click(item,index)" :key="index" >
                  <p style="font-size:16px">{{item.field_name}} <el-button size="mini" type="text" @click.prevent="toAddLand(item.field_name)">添加</el-button></p>
                  <p style="font-size:12px">{{item.field_address}}</p>
                  
              </div>
              </transition-group>
          </div>
    </div>
</template>
 <script>
import Config from "../../../config/server";
import AschJs from "asch-js";
export default {
  data() {
    return {
      mapHeight: 500,
      OverlayList: [], //地址列表
      PayLoadList: [], //覆盖物列表
      OverLay: null, //多边形
      isEdite: false,
      EditeText: "可编辑",
      PayLoadEdite: false,
      EditeIndex: -1,
      form_name: "",
      form_address: "",
      point: null,
      map: null,
      loading: false,
      longitude: 116.404,
      latitude: 39.915,
      description: "天安门"
    };
  },
  watch: {
    map(value) {
      console.log("map", value);
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
    this.$store.dispatch("setActive", "Area");
    var map = new BMap.Map("allmap", { enableMapClick: false });
    map.setDefaultCursor("default");
    map.enableScrollWheelZoom(true);
    // var top_left_control = new BMap.ScaleControl({
    //   anchor: BMAP_ANCHOR_TOP_LEFT
    // }); // 左上角，添加比例尺
    // var top_left_navigation = new BMap.NavigationControl();
    //map.addControl(top_left_control);
    //map.addControl(top_left_navigation);
    var point = new BMap.Point(this.longitude, this.latitude);
    map.centerAndZoom(point, 15);
    this.map = map;
    this.init();
    //this.MyControl();
    this.getArea();
  },
  destroyed() {
    if (this.map) {
      this.removeclick();
      this.Clear(true);
    }
  },
  methods: {
    init() {
      this.map.addEventListener("click", this.map_click);
    },
    map_click(e) {
      console.log(e);
      if (!this.isEdite) {
        this.OverlayList.push({ lng: e.point.lng, lat: e.point.lat });
        this.Update();
      }
    },
    MyControl() {
      var map = this.map;
      var that = this;
      function MyControls() {
        this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = new BMap.Size(80, 80);
      }
      MyControls.prototype = new BMap.Control();
      MyControls.prototype.initialize = function(map) {
        // 创建一个DOM元素
        var div = document.createElement("input");
        // 添加文字说明
        div.appendChild(document.createTextNode("放大2级"));
        // 设置样式
        //div.style.cursor = "pointer";
        div.style.padding = "10px";
        div.style.borderRadius = "4px";
        div.setAttribute("placeholder", "请输入城市");
        div.style.border = "1px solid gray";
        div.style.backgroundColor = "white";
        // 绑定事件,点击一次放大两级
        // div.onclick = function(e) {
        //   map.setZoom(map.getZoom() + 2);
        // };
        div.onkeydown = function(e) {
          if (event.keyCode == "13") {
            var geoc = new BMap.Geocoder();
            geoc.getLocation(div.value, function(rs) {
              debugger;
              if (!rs) {
                that.$message.error("未能获取当前输入行政区域");
                return false;
              }
              var count = rs.boundaries.length;
              if (count == 0) {
                that.$message.error("未能获取当前输入行政区域");
                return false;
              }
              var pointArray = [];
              for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], {
                  strokeWeight: 2,
                  strokeColor: "#ff0000"
                }); //建立多边形覆盖物
                map.addOverlay(ply); //添加覆盖物
                pointArray = pointArray.concat(ply.getPath());
              }
              map.setViewport(pointArray);
            });
          }
        };
        // 添加DOM元素到地图中
        map.getContainer().appendChild(div);
        // 将DOM元素返回
        return div;
      };
      // 创建控件
      var myZoomCtrl = new MyControls();
      // 添加到地图当中
      map.addControl(myZoomCtrl);
    },
    removeclick() {
      this.map.removeEventListener("click", this.map_click);
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
    },
    SearCh() {
      if (this.point) {
        var geoc = new BMap.Geocoder();
        geoc.getLocation(this.point, rs => {
          var addComp = rs.addressComponents;
          this.form_address = addComp.city;
          // addComp.province +
          // ", " +
          // addComp.city +
          // ", " +
          // addComp.district +
          // ", " +
          // addComp.street +
          // ", " +
          // addComp.streetNumber;
        });
      }
    },
    Update() {
      var Objlist = this.OverlayList.map(function(item) {
        return new BMap.Point(item.lng, item.lat);
      });
      if (this.OverLay) {
        this.OverLay.setPath(Objlist);
      } else {
        this.OverLay = new BMap.Polygon(Objlist, {
          fillColor: "",
          strokeColor: Config.Map_Area_strokeColor,
          strokeWeight: Config.Map_Area_strokeWeight,
          strokeOpacity: Config.Map_Area_strokeOpacity
        });
        this.map.addOverlay(this.OverLay);
      }
      if (Objlist.length == 2) {
        this.point = Objlist[0];
        this.SearCh();
      }
    },
    Clear(isDelete) {
      if (this.isEdite) {
        this.$message.error("正在编辑中");
        return false;
      }
      if (isDelete) {
        this.map.removeOverlay(this.OverLay);
      }
      this.OverlayList = [];
      this.OverLay = null;
      this.form_name = "";
      this.form_address = "";
      this.point = null;
    },
    Add() {
      var user = this.$store.state.user;
      if (!user) {
        this.$message.error("请登录");
        return false;
      }
      if (this.isEdite) {
        this.$message.error("正在编辑中");
        return false;
      }
      this.OverLay.field_name = this.form_name;
      if (this.OverLay.field_name.trim().length == 0) {
        this.OverLay.field_name = Math.random()
          .toString(36)
          .substr(2);
      }

      this.OverLay.field_address = this.form_address;
      var lng = this.OverlayList.map(function(item) {
        return item.lng + "," + item.lat;
      }).join("|");
      var centerPoint=this.getCenterPoint();
      this.SubMit(this.OverLay.field_name, lng,this.form_address,centerPoint, () => {
        this.PayLoadList.push(this.OverLay);
        this.Clear(false);
      });
    },
    getCenterPoint(){
      var x=this.OverlayList.map(function(item) {
        return item.lng ;
      });
      var y=this.OverlayList.map(function(item) {
        return item.lat ;
      });
      let x_sum=0;
      let y_sum=0;
      for(var i=0;i<this.OverlayList.length;i++){
        x_sum+=this.OverlayList[i].lng;
        y_sum+=this.OverlayList[i].lat;
      }
      var result_x=x_sum/this.OverlayList.length;
      var result_y=y_sum/this.OverlayList.length;
      return result_x+","+result_y;
    },
    Remove(index) {
      this.OverlayList.splice(index, 1);
      this.Update();
    },
    Edite() {
      if (this.isEdite) {
        //如果编辑状态
        this.isEdite = false;
        this.OverLay.disableEditing();
        this.EditeText = "可编辑";
        var list = this.OverLay.getPath();
        console.log("List", list);
        this.OverlayList = list;
        this.point = list[2];
        this.SearCh();
      } else {
        //如果是点击状态
        if (this.OverLay) {
          this.isEdite = true;
          this.OverLay.enableEditing();
          this.EditeText = "取消编辑";
        }
      }
    },
    Click(PayLoad, key) {
      PayLoad.setStrokeColor(Config.Map_Area_strokeColor_Cover);
      setTimeout(function() {
        PayLoad.setStrokeColor(Config.Map_Area_strokeColor);
      }, 2000);
      var list = PayLoad.getPath();
      console.log(list);
      this.map.setViewport(list);
      this.OverLay = PayLoad;
      this.OverlayList = list;
      this.point = list[0];
      this.form_name = PayLoad.field_name;
      this.form_address = PayLoad.field_address;
      this.PayLoadEdite = true; //编辑状态
      this.EditeIndex = key;
    },
    Save() {
      if (this.isEdite) {
        this.$message.error("正在编辑中");
        return false;
      }
      var item = this.PayLoadList[this.EditeIndex];
      if (item) {
        item.field_name = this.form_name;
        item.field_address = this.form_address;
        this.PayLoadList[this.EditeIndex] = item;
        this.EditeIndex = -1;
        this.PayLoadEdite = false;
        this.Clear();
      }
    },
    SubMit(name, lng, address, centerPoint,callback) {
      this.loading = true;
      var secret = this.$store.state.user.secret;
      var type = 2000;
      var fee = String(0.1 * 1e8);
      var args = '["' + name + '","' + lng + '","' + address + '","'+centerPoint+'"]';
      var options = { fee: fee, type: type, args: args };
      var trs = AschJs.dapp.createInnerTransaction(options, secret);
      this.btn_loading = true;
      this.$http
        .put(
          Config.tixian,
          {
            transaction: trs
          },
          {
            headers: {
              magic: "594fe0f3",
              version: ""
            }
          }
        )
        .then(data => data.data)
        .then(data => {
          this.loading = false;
          if (data.success) {
            this.$message.success("添加成功");
            if (callback) callback();
          } else {
            this.$message.error(data.error);
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    getArea() {
      var map = this.map;
      this.$http
        .get(Config.areas)
        .then(data => data.data)
        .then(data => {
          if (data.success) {
            var list = data.list;
            var list1 = list.map(function(item) {
              var pointList = []; //new BMap.Point(item.lng, item.lat);
              var ss = item.lng.split("|");
              var pointList = ss.map(function(value) {
                var s1 = value.split(",");
                return new BMap.Point(Number(s1[0]), Number(s1[1]));
              });
              var PayLoad = new BMap.Polygon(pointList, {
                fillColor: "",
                strokeColor: Config.Map_Area_strokeColor,
                strokeWeight: Config.Map_Area_strokeWeight,
                strokeOpacity: Config.Map_Area_strokeOpacity
              });
              map.addOverlay(PayLoad);
              PayLoad.field_name = item.name;
              PayLoad.field_address = item.address;
              return PayLoad;
            });
            this.PayLoadList = list1;
          }
        });
    },
    toAddLand(name) {
      this.$store.dispatch("setActive", "Land");
      this.$router.push({ name: "Land", params: { name: name } });
    }
  }
};
</script>
<style>
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
