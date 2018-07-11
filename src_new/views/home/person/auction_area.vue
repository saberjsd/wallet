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
      zoom: 16,
      lableS: []
    };
  },
  computed: {},
  methods: {
    init_map() {
      if (this.Map) {
        return false;
      }
      //   var map = new BMap.Map("allMap", {mapType:BMAP_PERSPECTIVE_MAP});
      var map = new BMap.Map("allMap", { maxZoom: 18, minZoom: 13 });
      map.centerAndZoom(new BMap.Point(-73.865725, 40.845706), this.zoom);
      map.enableScrollWheelZoom(true);
      map.enableDragging();
      var that = this;
      map.addEventListener("zoomend", function(e) {
        that.toggle();
      });
      //map.setCurrentCity("纽约");
      //this.My;
      this.Map = map;
    },
    toggle(){
        this.zoom = this.Map.getZoom();
        console.log(this.zoom);
        if (this.zoom <= 16) {
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
    renderArea(data) {
      var map = this.Map;
      var ss = data.lng.split("|");
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
      this.Map.addOverlay(PayLoad);

      this.Map.setViewport(pointList);
    },
    /**
     * @param {{name:string,lng,id,Lands:Array<{id,lng,name,centerpoint_lng,centerpoint_lat}>}} datas
     * @param {Array<{auctionId,authorId,id,isAuction,name,status,Auction:{id,status,begin_time,endTime,amount,MaxAmount}}>} auctions
     */
    renderLand(datas, auctions) {
      var tmp = {}; //land id
      datas.Lands.map(function(item) {
        if (tmp[item.id]) {
        } else {
          tmp[item.id] = item;
        }
      });
      auctions.map(function(item) {
        if (tmp[item.id] && item.isAuction) {
          //拍卖中
          tmp[item.id].Auction = item.Auction;
          tmp[item.id].isAuction = true;
        }
      });
      for (var items in tmp) {
        var item = tmp[items];
        var ss = item.lng.split("|");
        var pointList = ss.map(function(itme) {
          var s1 = itme.split(",");
          return new BMap.Point(Number(s1[0]), Number(s1[1]));
        });
        var PayLoad = new BMap.Polygon(pointList, {
          strokeColor: item.isAuction
            ? Config.Map_Land_strokeColor
            : Config.Map_Land_strokeColor_Cover,
          strokeWeight: Config.Map_Land_strokeWeight,
          strokeOpacity: Config.strokeOpacity
        });
        var sContent = "";
        if (item.isAuction) {
          sContent =
            "正在拍卖" +
            "<br/>" +
            "当前价" +
            item.Auction.MaxAmount +
            "<br/>" +
            "起拍价" +
            item.Auction.amount +
            "<br/>" +
            "<a class='el-button el-button--text el-button--small' target='blank' href='/person/auctions/" +
            item.Auction.id +
            "'>参与拍卖</>";
        } else {
          sContent = "所有人:" + "<br/>" + item.authorId;
        }

        var point = new BMap.Point(item.centerPoint_lng, item.centerPoint_lat);
        //var Maker = new BMap.Marker(point);
        var lable = new BMap.Label(sContent, { position: point });
        this.Map.addOverlay(lable);
        this.lableS.push(lable);
        this.Map.addOverlay(PayLoad);
      }
      this.toggle();
    },
    getAuction(name) {
      return this.$http
        .get(Config.areaAuction + "/" + name)
        .then(data => data.data)
        .catch(error => {
          return { success: false, error: error };
        });
    },
    getAreaS(name) {
      var jsonstr = window.localStorage.getItem(name);
      console.log("json", jsonstr);
      if (jsonstr) {
        return { success: true, data: JSON.parse(jsonstr) };
      }
      return this.$http
        .get(Config.areas + "/" + name)
        .then(data => {
          return data.data;
        })
        .catch(error => {
          return { success: false, error: error };
        });
    }
  },
  mounted() {
    this.init_map();
    var name = this.$route.params.name;
    var that = this;
    this.$http.all([this.getAuction(name), this.getAreaS(name)]).then(
      this.$http.spread(function(auction, area) {
        console.log(area, auction);
        if (area.success) {
          window.localStorage.setItem(name, JSON.stringify(area.data));
        }
        let auctions = null;
        if (auction.success) {
          auctions = auction.list;
        }
        that.renderArea(area.data);
        that.renderLand(area.data, auctions);
      })
    );
  }
};
</script>
<style>

</style>
