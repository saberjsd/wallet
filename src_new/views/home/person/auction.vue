
<template>
  <div class="auction">
        <el-row>
            <el-col :span="6">
                <div class="filter">
                      <el-select
    v-model="city"
    style="margin-left: 20px;"
    @change="CityClick()"
    placeholder="请选择">
    <el-option
      v-for="item in cityList"
      :key="item"
      :label="item"
      :value="item">
    </el-option>
  </el-select>
    <el-select
    v-model="Area"
    @change="AreaClick()"
    style="margin-left: 20px;"
    placeholder="请选择">
    <el-option
      v-for="item in AreaList"
      :key="item.name"
      :label="item.name"
      :value="item.name">
    </el-option>
  </el-select>
                </div>
                <div class="LandList">
                    <div    class="LandListitem" 
                            v-for="(item,index) in LandList" 
                            :key="index"
                            @click.prevent="ShowPayLoad(item.name)"
                            >
                        <p>名称:{{item.Auction.landName}}</p>
                        <p>起拍价:{{item.Auction.amount}}</p>
                        <p>现价:{{item.Auction.MaxAmount}}</p>
                        <p>剩余时间:{{item.Auction.endTime}}</p>
                        <div class="oper">
                              <el-button type="primary" size="mini"  @click.prevent="JoinToAuction(item.Auction.id)"> 参与拍卖</el-button>
                        </div>
                    </div>
                </div>

            </el-col>

            <el-col :span="18">
                <div class="allmap" id="allmap" :style="allMapStyle">

                </div>
            </el-col>
        </el-row>
  </div>
</template>

<script>
import Config from "../../../config/server";
import AschJs from "asch-js";
export default {
  data() {
    var height = this.getClientHeight() - 100;
    return {
      allMapStyle: {
        height: height + "px"
      },
      cityList: [],
      AreaList: [],
      AreaPayLoad: null,
      LandList: [],
      LandPayLoadList: [],
      Area: "",
      city: "",

      map: null,
      timer: null
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
    var height = this.getClientHeight() - 100;
    console.log(height);
    this.allMapStyle.height = height + "px";
    this.init();
    this.getCitysMessage();
    this.timer = setInterval(() => {
      this.changTime();
    }, 1000);
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    init() {
      var map = new BMap.Map("allmap"); // 创建Map实例
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
      //添加地图类型控件
      map.addControl(
        new BMap.MapTypeControl({
          mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
        })
      );
      map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      var that = this;
      map.addEventListener("zoomend", function(e) {
        var zoom = map.getZoom();
        if (zoom < 16) {
          that.clearLand();
        } else {
          that.drawLands();
        }
      });
      this.map = map;
    },
    getLand() {
      this.$http
        .get(Config.lands + "/",{params:{status:"0",landName:this.Area}})
        .then(function(data) {
          return data.data;
        })
        .then(data => {
          if (data.success) {
            this.LandList = data.list.filter(function(item){
              return item.Auction?true:false;
            });
            this.drawLands();
            this.changTime();
          } else {
            this.$message.error(data.error);
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    changTime() {
      this.LandList = this.LandList.map(function(item) {
        //var begin = AschJs.utils.slots.getRealTime(item.timestamp_begin);
        var Auction=item.Auction;
        var end = AschJs.utils.slots.getRealTime(Auction.end_time);
        var endDate = new Date(end); //最后时间
        var nowDate = new Date(); //现在时间
        var endTime = endDate.getTime() - nowDate.getTime(); //剩余时间
        var aday = 1 * 24 * 3600 * 1000;
        var ahourse = 1 * 3600 * 1000;
        var amiuate = 1 * 60 * 1000;
        var asecond = 1 * 1000;
        var day = 0;
        var hourse = 0;
        var miniut = 0;
        var second = 0;
        if (endTime > aday) {
          day = parseInt(endTime / aday);
          endTime -= day * aday;
        }
        if (endTime > ahourse) {
          hourse = parseInt(endTime / ahourse);
          endTime -= hourse * ahourse;
        }
        if (endTime > amiuate) {
          miniut = parseInt(endTime / amiuate);
          endTime -= miniut * amiuate;
        }
        if (endTime > asecond) {
          second = parseInt(endTime / asecond);
        }
        item.Auction.endTime = [
          day,
          "天",
          hourse,
          "时",
          miniut,
          "分",
          second,
          "秒"
        ].join(" ");
        return item;
      });
    },
    clearLand() {
      this.map.clearOverlays();
    },
    drawLands() {
      this.map.clearOverlays();
      var zoom = this.map.getZoom();
      if (zoom < 16) {
        return false;
      }
      var that = this;
      var map = that.map;
      this.LandList.forEach(function(item) {
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
        PayLoad.Field_Name = item.name;
        var sContent =
          "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>区域名:" +
          item.name +
          "</h4>" +
          "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>现在拍卖数量:" +
          item.timestamp +
          "</p>" +
          "</div>";
        var infoWindow = new BMap.InfoWindow(sContent);
        var point = pointList[0];
        PayLoad.addEventListener("mouseover", function(e) {
          map.openInfoWindow(infoWindow, pointList[0]);
        });
        PayLoad.addEventListener("mouseout", function(e) {
          map.closeInfoWindow(infoWindow, pointList[0]);
        });
        //图片加载完毕重绘infowindow
        that.LandPayLoadList.push(PayLoad);
        map.addOverlay(PayLoad);
      });
    },
    ShowPayLoad(name) {
      var item = this.LandPayLoadList.filter(function(item) {
        return item.Field_Name == name;
      });
      if (item.length == 0) {
        return false;
      }
      var pointList = item[0].getPath();
      this.map.setViewport(pointList);
    },
    getCitysMessage() {
      this.$http
        .get(Config.citys)
        .then(data => data.data)
        .then(data => {
          if (data.success) {
            this.cityList = data.list;
            return { error: null, list: data.list };
          } else {
            this.$message.error(data.error);
            return { error: true, data: data.error };
          }
        })
        .then(data => {
          if (data.error) {
            return false;
          }
          if (data.list.length == 0) {
            console.error("error");
          }
          return this.$http.get(Config.areas, {
            params: {
              address: data.list[0]
            }
          });
        })
        .then(data => data.data)
        .then(data => {
          if (data.success) {
            this.AreaList = data.list;
          } else {
            this.$message.error(data.error);
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    getArea(){
      this.$http.get(Config.areas, {
            params: {
              address: this.city
            }
      }).then(data=>data);
    },
    getAreaMessage() {},
    getClientHeight() {
      var clientHeight = 0;
      // if (document.body.clientHeight && document.documentElement.clientHeight) {
      //   var clientHeight =
      //     document.body.clientHeight < document.documentElement.clientHeight
      //       ? document.body.clientHeight
      //       : document.documentElement.clientHeight;
      // } else {
      //   var clientHeight =
      //     document.body.clientHeight > document.documentElement.clientHeight
      //       ? document.body.clientHeight
      //       : document.documentElement.clientHeight;
      // }
      clientHeight = window.innerHeight;
      return clientHeight;
    },
    CityClick() {
      console.log(this.city);
    },
    AreaClick() {
      this.ClickAreaItem(this.Area);
      this.getLand();
    },
    ClickAreaItem(command) {
      this.map.clearOverlays();
      this.map.removeOverlay(this.AreaPayLoad);
      var item = this.AreaList.filter(function(items) {
        return items.name == command;
      });
      if (item.length == 0) {
        return false;
      }
      //显示区块
      var item1 = item[0];
      var ss = item1.lng.split("|");
      var pointList = ss.map(function(value) {
        var s1 = value.split(",");
        return new BMap.Point(Number(s1[0]), Number(s1[1]));
      });
      //遮罩层
      var PayLoad = new BMap.Polygon(pointList, {
        fillColor: "",
        strokeColor: Config.Map_Area_strokeColor,
        strokeWeight: Config.Map_Area_strokeWeight,
        strokeOpacity: Config.Map_Area_strokeOpacity
      });
      PayLoad.disableMassClear();
      var sContent =
        "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>区域名:" +
        item1.name +
        "</h4>" +
        "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>现在拍卖数量:10</p>" +
        "</div>";
      var infoWindow = new BMap.InfoWindow(sContent);
      var point = pointList[0];
      this.map.addOverlay(PayLoad);
      var map = this.map;
      PayLoad.addEventListener("mouseover", function(e) {
        map.openInfoWindow(infoWindow, pointList[0]);
      });
      PayLoad.addEventListener("mouseout", function(e) {
        map.closeInfoWindow(infoWindow, pointList[0]);
      });

      //图片加载完毕重绘infowindow
      //PayLoad.openInfoWindow(infoWindow);
      this.AreaPayLoad = PayLoad;
      this.map.setViewport(pointList);
    },
    JoinToAuction(id){
      this.$prompt('请输入金额', '参与拍卖', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: function(value){
              var reg=/^[0-9]*$/;
              if(reg.test(value)){
                if(Number(value)>0){
                  return true;
                }else{
                  return "金额必须大于0"
                }
              }else{
                return "金额必须为数字"
              }
            },
          inputErrorMessage: '金额不正确'
        }).then(({ value }) => {
            var secret = this.$store.state.user.secret;
            var type = 2002;
            var fee = String(0.1 * 1e8);
            var args=[id,value];
            var options={ fee: fee, type: type, args: JSON.stringify(args) };
            var trs = AschJs.dapp.createInnerTransaction(options, secret);

            return this.$http.put(Config.tixian,{transaction: trs},{headers: {
              magic: Config.magic,
              version: ""
            }})
        }).then(data=>data.data).then(data=>{
          if(data.success){
            this.$message.success("参与成功");
          }else{
            this.$message.error(data.error);
          }
        }).catch((error) => {
            this.$message.error(error);
        });
    },
  }
};
</script>

<style>
.LandList {
  padding: 5px;
  font-size: 14px;
}
.LandListitem {
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 5px;
}
.LandListitem:hover {
  background: rgb(221, 233, 245);
}
</style>
