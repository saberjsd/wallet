<template>
    <div class="left_area">
          <div class="overLayList">
			  	<router-link class="el-button el-button--warning el-button--mini" to="/BMap/Area">返回</router-link>
                <el-button size="mini" type="warning" @click="Clear(true)">清空</el-button>
                <el-button size="mini" type="primary" @click="Edite()">{{EditeText}}</el-button>
                <el-button v-if="!PayLoadEdite" size="mini" :loading="loading" type="primary" @click="Add()">添加</el-button>
                <el-button v-else size="mini" type="primary" @click.prevent="Save()">保存</el-button>
                <br/>
                <label>地址</label>
                <el-input v-model="form_address" placeholder="区块地址"/>
                <label>名字</label>
                <el-input v-model="form_name" placeholder="区块名"/>
                 <label>起拍价</label>
                <el-input v-model="form_amount" type="number" placeholder="起拍价"/>
                <label>时间</label>
                <el-date-picker
      v-model="form_date"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
                <transition-group name="el-fade-in-linear">
                    <div class="item" v-for="(item,index) in OverlayList" :key="index" >
                        <p style="font-size:12px">{{item.lng}}-{{item.lat}} <el-button size="mini" type="warning"  @click.prevent="Remove(index)">删除</el-button></p>
                        
                    </div>
                </transition-group>

          </div>
          <div class="PayLoadList">
              <transition-group name="el-fade-in-linear">
              <div class="PayLoadItem" v-for="(item,index) in PayLoadList" @click="Click(item,index)" :key="index" >
                  <p style="font-size:16px">{{item.field_name}}</p>
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
  props: ["name"],
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
      form_amount: 100,
      form_date: [],
      point: null,
      map: null,
      longitude: 116.404,
      latitude: 39.915,
      description: "天安门",
      loading: false
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
    this.$store.dispatch("setActive", "Land");
    var map = new BMap.Map("allmap", { enableMapClick: false });
    map.setDefaultCursor("default");
    map.enableScrollWheelZoom(true);
    map.addEventListener("click", this.map_click);
    // var top_left_control = new BMap.ScaleControl({
    //   anchor: BMAP_ANCHOR_TOP_LEFT
    // }); // 左上角，添加比例尺
    // var top_left_navigation = new BMap.NavigationControl();
    // map.addControl(top_left_control);
    // map.addControl(top_left_navigation);
    var point = new BMap.Point(this.longitude, this.latitude);
    map.centerAndZoom(point, 15);
    this.map = map;
    if (this.name) {
      this.getArea(this.name);
      //this.getLands(this.name);
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
    removeclick() {
      this.map.removeEventListener("click", this.map_clic);
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
          this.form_address = addComp.city + ", " + addComp.district;
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
          strokeColor: Config.Map_Land_strokeColor,
          strokeWeight: Config.Map_Land_strokeWeight,
          strokeOpacity: Config.strokeOpacity
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
      this.form_date = [];
      this.form_amount = 0;
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
      if (this.form_date.length != 2) {
        this.$message.error("请添加日期");
        return false;
      }
      if (this.form_name.length == 0) {
        this.form_name = Math.random()
          .toString(36)
          .substr(2);
      }
      var lng = this.OverlayList.map(function(item) {
        return item.lng + "," + item.lat;
      }).join("|");
      if (!this.name) {
        return false;
      }
      var begin_time = this.form_date[0].getTime();
      var begin_asch_time = AschJs.utils.slots.getTime(begin_time);
      var end_time = this.form_date[1].getTime();
      var end_asch_time = AschJs.utils.slots.getTime(end_time);
      var centerPoint=this.getCenterPoint();
      this.SubMit(
        this.form_name,
        lng,
        this.form_address,
        this.form_amount,
        begin_asch_time,
        end_asch_time,
        this.name,
        centerPoint,
        () => {
          this.OverLay.field_name = this.form_name;
          this.OverLay.field_address = this.form_address;
          this.OverLay.field_amount = this.form_amount;
          this.OverLay.field_date = this.form_date;
          this.PayLoadList.push(this.OverLay);
          this.Clear(false);
        }
      );
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
      PayLoad.setStrokeColor(Config.Map_Land_strokeColor_Cover);
      setTimeout(function() {
        PayLoad.setStrokeColor(Config.Map_Land_strokeColor);
      }, 2000);
      var list = PayLoad.getPath();
      console.log(list);
      this.map.setViewport(list);
      this.OverLay = PayLoad;
      this.OverlayList = list;
      this.point = list[0];
      this.form_name = PayLoad.field_name;
      this.form_address = PayLoad.field_address;
      this.form_amount = PayLoad.field_amount;
      this.form_date = PayLoad.field_date;
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
    render(data1) {
      var map = this.map;
      var pointList = data1.lng.split("|");
      var points = pointList.map(function(item) {
        var items = item.split(",");
        return new BMap.Point(Number(items[0]), Number(items[1]));
      });
      var PayLoad = new BMap.Polygon(points, {
        strokeColor: Config.Map_land_Area_strokeColor,
        strokeWeight: Config.Map_land_Area_strokeWeight,
        fillColor: ""
      });
      map.addOverlay(PayLoad);
      if (data1.Lands.length > 0) {
        var list1 = data1.Lands.map(function(item) {
          var pointList = []; //new BMap.Point(item.lng, item.lat);
          var ss = item.lng.split("|");
          var pointList = ss.map(function(value) {
            var s1 = value.split(",");
            return new BMap.Point(Number(s1[0]), Number(s1[1]));
          });
          var PayLoad2 = new BMap.Polygon(pointList, {
            strokeColor: Config.Map_Land_strokeColor,
            strokeWeight: Config.Map_Land_strokeWeight,
            strokeOpacity: Config.strokeOpacity
          });
          map.addOverlay(PayLoad2);
          PayLoad2.field_name = item.name;
          PayLoad2.field_address = item.address;
          var begin = AschJs.utils.slots.getRealTime(item.timestamp_begin);
          var end = AschJs.utils.slots.getRealTime(item.timestamp_end);
          PayLoad2.field_date = [new Date(begin), new Date(end)];
          return PayLoad2;
        });
      }
      map.setViewport(points);
      this.PayLoadList = list1;
    },
    getArea(name) {
      // var name2 = window.localStorage.getItem(name);
      // if (name2) {
      //   var json = JSON.parse(name2);
      //   console.log(json);
      //   this.render(json);
      // } else {
        this.$http
          .get(Config.areaLand + name)
          .then(data => data.data)
          .then(data => {
            if (data.success) {
              var data1 = data.data;
              window.localStorage.setItem(name, JSON.stringify(data1));
              this.render(data1);
            }
          });
      // }
    },
    getLands(name) {
      var map = this.map;
      this.$http
        .get(Config.lands + "/" + name)
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
                strokeColor: Config.Map_Land_strokeColor,
                strokeWeight: Config.Map_Land_strokeWeight,
                strokeOpacity: Config.strokeOpacity
              });
              map.addOverlay(PayLoad);
              PayLoad.field_name = item.name;
              PayLoad.field_address = item.address;
              PayLoad.field_amount = item.amount;
              var begin = AschJs.utils.slots.getRealTime(item.timestamp_begin);
              var end = AschJs.utils.slots.getRealTime(item.timestamp_end);
              PayLoad.field_date = [new Date(begin), new Date(end)];
              return PayLoad;
            });
            this.PayLoadList = list1;
          }
        });
    },
    SubMit(name, lng, address, amount, begin_time, end_time, name2,centerPoint, callback) {
      this.loading = true;
      var secret = this.$store.state.user.secret;
      var type = 2001;
      var fee = String(0.1 * 1e8);
      var args =
        '["' +
        name +
        '","' +
        lng +
        '","' +
        address +
        '","' +
        name2 +
        '","' +
        begin_time +
        '","' +
        end_time +
        '","' +
        amount +
        '","' +
        centerPoint +
        '"]';
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
    }
  },

  destroyed() {
    if (this.map) {
      this.removeclick();
      this.Clear(true);
    }
  }
};
</script>
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