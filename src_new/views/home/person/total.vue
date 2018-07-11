<template>
    <div>
        <div class="Map" id="allMap"  style="width:600px;height:600px"></div>
    </div>
</template>
<script>
import Config from "../../../config/server";
export default {
  data() {
    return {
      Map: null,
      Map_center_point: {
        lng: -73.865725,
        lat: 40.845706
      },
      zoom: 12,
      lableS: [],
      privateTimer: null,
      tmp: {}
    };
  },
  computed: {},
  methods: {
    init_map() {
      if (this.Map) {
        return false;
      }
      var that = this;
      //   var map = new BMap.Map("allMap", {mapType:BMAP_PERSPECTIVE_MAP});
      var map = new BMap.Map("allMap", { maxZoom: 16, minZoom: 12 });
      map.centerAndZoom(new BMap.Point(-73.865725, 40.845706), this.zoom);
      map.enableScrollWheelZoom(true);
      function ZoomControl() {
        // 默认停靠位置和偏移量
        this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = new BMap.Size(10, 10);
      }

      // 通过JavaScript的prototype属性继承于BMap.Control
      ZoomControl.prototype = new BMap.Control();

      // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
      // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
      ZoomControl.prototype.initialize = function(map) {
        // 创建一个DOM元素
        var div = document.createElement("div");
        // 添加文字说明
        div.appendChild(document.createTextNode("回退"));
        // 设置样式
        div.style.cursor = "pointer";
        div.style.border = "1px solid gray";
        div.style.backgroundColor = "white";
        div.style.borderRadius="50%";
        div.style.height="50px";
        div.style.width="50px";
        div.style.textAlign="center";
        div.style.lineHeight="50px"
        // 绑定事件,点击一次放大两级
        div.onclick = function(e) {
          map.centerAndZoom(new BMap.Point(-73.865725, 40.845706), that.zoom);
        };
        // 添加DOM元素到地图中
        map.getContainer().appendChild(div);
        // 将DOM元素返回
        return div;
      };
      // 创建控件
      var myZoomCtrl = new ZoomControl();
      // 添加到地图当中
      map.addControl(myZoomCtrl);
      map.addEventListener("dragend", function({ type, target, pixel, point }) {
        clearTimeout(that.privateTimer);
        that.privateTimer = setTimeout(function() {
          that.getAreaS();
          console.log("dragEnd", point);
        }, 2000);
      });
      map.enableDragging();
      map.addEventListener("zoomend", function(e) {
        that.toggle();
      });
      //map.setCurrentCity("纽约");
      //this.My;
      this.Map = map;
    },
    toggle() {
      this.zoom = this.Map.getZoom();
      console.log(this.zoom);
      if (this.zoom <= 14) {
        this.hide();
      } else {
        this.show();
      }
    },
    hide() {
      this.lableS.forEach(item => {
        item.hide();
      });
    },
    show() {
      this.lableS.forEach(item => {
        item.show();
      });
    },
    renderArea(areaList) {
      var map = this.Map;
      areaList.map(item => {
        if (this.tmp[item.name]) {
          return false;
        }
        var ss = item.lng.split("|");
        var pointList = ss.map(function(itme) {
          var s1 = itme.split(",");
          return new BMap.Point(Number(s1[0]), Number(s1[1]));
        });
        var PayLoad = new BMap.Polygon(pointList, {
          strokeColor: Config.Map_land_Area_strokeColor,
          strokeWeight: Config.Map_land_Area_strokeWeight,
          fillColor: ""
          //strokeOpacity: Config.Map_land_Area_strokeOpacity
        });
        var sContent =
          "地块数量10,<br/>正在拍卖:2" +
          "<br/>" +
          "<a target='blank' class='el-button el-button--text el-button--small' href='/person/areas/" +
          item.name +
          "'>查看拍卖</>";
        var point = new BMap.Point(item.centerPoint_lng, item.centerPoint_lat);
        var lable = new BMap.Label(sContent, { position: point });
        this.Map.addOverlay(lable);
        this.Map.addOverlay(PayLoad);
        this.lableS.push(lable);
        this.tmp[item.name] = 1;
        //this.Map.setViewport(pointList);
      });
      this.toggle();
    },
    getAreaS() {
      this.Map_center_point = {
        lng: this.Map.getCenter().lng,
        lat: this.Map.getCenter().lat
      };
      this.zoom = this.Map.getZoom();
      var distance = Config.Zoom[this.zoom];

      this.$http
        .get(Config.point, { params: this.Map_center_point })
        .then(data => data.data)
        .then(data => {
          if (data.success) {
            console.log(data);
            this.renderArea(data.list);
          } else {
            console.error(data.error);
            _;
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  mounted() {
    this.init_map();
    this.getAreaS();
  }
};
</script>
<style>

</style>
