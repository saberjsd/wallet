<template>
    <div class="auctionDetail clearfix">
        <div class="auction-header">
            <h1 class="Address"></h1>
            <div class="pm-main-1" id="MyMap">

            </div>
            <div v-if="Auction" class="pm-main-2">
                <p class="ad-price">
                    <span class="label">当前价</span>
                    <span class="value">{{Auction.MaxAmount}}</span>
                </p>
				<p class="ad-person">
                    <span class="label">起拍价</span>
                    <span class="value">{{Auction.amount}}</span>
                </p>
                <p class="ad-person">
                    <span class="label">出价人</span>
                    <span class="value">{{getStr}}</span>
                </p>
                <div   v-if="!AuctionEnd">
					<p class="ad-time"><span class="label">距结束</span>
                    <span class="value">
                        <var>{{day}}</var><em>天</em>
                        <var>{{hourse}}</var><em>时</em>
                        <var>{{minute}}</var><em>分</em>
                        <var>{{second}}</var><em>秒</em>
                    </span></p>
					<el-button v-if="!loadingBtn" type="primary" @click="Join()">参与拍卖</el-button>
					<el-button v-else type="primary" :disabled="true" :loading="true">{{loadingBtnTxt}}</el-button>
                </div>
				<div v-else-if="AuctionEnd" class="AuctionEnd">
					<p>成交时间:{{Auction.timestamp_format}}</p>
					<p>拍卖已结束</p>
				</div>
            </div>

        </div>
        <div class="auction-body">
            <el-table
                :data="Logs"
            >
      <el-table-column
        prop="timestamp_format"
        label="时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="authorId"
        label="参与人">
      </el-table-column>
      <el-table-column
        width="100"
        label="金额"
		prop="amount"
		>

      </el-table-column>
    </el-table>
	    <el-pagination
      			@current-change="handleCurrentChange"
      			:current-page="pageIndex"
      			
      			:page-size="10"
      			layout="total, prev, pager, next, jumper"
      			:total="LogCount">
    </el-pagination>
        </div>
    </div>
</template>
<script>
import Config from "../../../config/server";
import AschJs from "asch-js";
export default {
  data() {
    return {
      Map: null,
      auctionId: null,
      Auction: null,
      Land: null,
      LogCount: 0,
      Logs: [],
      loading: false,
      day: "00",
      hourse: "00",
      minute: "00",
      second: "00",
      getTimer: 0,
      timeTimer: 0,
      pageIndex: 1,
      loadingBtn: false,
      loadingBtnTxt: "10s",
      loadingTimer: null,
      AuctionEnd: true
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
    var params = this.$route.params;
    this.auctionId = params.id;
    clearInterval(this.getTimer);
    clearInterval(this.timeTimer);
    this.getAuction(this.auctionId, 0, 1).then(() => {
      this.init();
      this.drawLand();
      if (this.Auction) {
        this.timeTimer = setInterval(() => {
          this.setTimer();
        }, 1000);
      }
    });
    this.getTimer = setInterval(() => {
      this.getAuction(this.auctionId, 10 * (this.pageIndex - 1), 0);
    }, 10000);
  },

  destroyed() {
    clearInterval(this.getTimer);
    clearInterval(this.timeTimer);
    clearInterval(this.loadingTimer);
  },
  computed: {
    getStr() {
      var str = this.Auction.MaxAuthorId;
      var user = this.$store.state.user;
      if (str.length > 0) {
        var new1 = str.substring(0, 4);
        var new2 = str.substring(str.length - 4, str.length);
        var result = new1 + "***" + new2;
        if (user) {
          if (user.address == str) {
            result += "(我)";
          }
        }
        return result;
      } else {
        return "无";
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getAuction(this.auctionId, 10 * (this.pageIndex - 1));
    },
    init() {
      if (this.Map) {
        return false;
      }
      var map = new BMap.Map("MyMap"); // 创建Map实例
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
      //添加地图类型控件
      // map.addControl(
      //     new BMap.MapTypeControl({
      //         mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
      //     })
      // );
      map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
      //map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      this.Map = map;
    },
    drawLand() {
      if (!this.Land) {
        return false;
      }
      var ss = this.Land.lng.split("|");
      var pointList = ss.map(function(itme) {
        var s1 = itme.split(",");
        return new BMap.Point(Number(s1[0]), Number(s1[1]));
      });
      var PayLoad = new BMap.Polygon(pointList, {
        strokeColor: Config.Map_Land_strokeColor,
        strokeWeight: Config.Map_Land_strokeWeight,
        strokeOpacity: Config.strokeOpacity
      });
      this.Map.addOverlay(PayLoad);
      this.Map.setViewport(pointList);
    },
    getAuction(id, offset = 0, isFirst = 0) {
      return this.$http
        .get(Config.auctionId + id, {
          timeout: 9000,
          params: {
            offset: offset,
            isFirst: isFirst
          }
        })
        .then(data => data.data)
        .then(data => {
          if (data.success) {
            var user = this.$store.state.user;
            this.Auction = data.Auction;
            this.Land = data.Land;
            this.LogCount = data.log_count;
            this.Logs = data.logs.map(function(item) {
              if (user.address == item.authorId) {
                item.authorId = "（我）" + item.authorId;
              }
              return item;
            });
          } else {
            console.error(data.error);
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    setTimer() {
      var end = AschJs.utils.slots.getRealTime(this.Auction.end_time);
      var endDate = new Date(end); //最后时间
      var nowDate = new Date(); //现在时间
      var endTime = endDate.getTime() - nowDate.getTime(); //剩余时间
      if (endTime <= 0) {
        this.AuctionEnd = true;
        this.day = "00";
        this.hourse = "00";
        this.minute = "00";
        this.second = "00";
      } else {
        this.AuctionEnd = false;
        var aday = 1 * 24 * 3600 * 1000;
        var ahourse = 1 * 3600 * 1000;
        var amiuate = 1 * 60 * 1000;
        var asecond = 1 * 1000;
        var day = 0;
        var hourse = 0;
        var miniut = 0;
        var second = 0;
        if (endTime >= aday) {
          day = parseInt(endTime / aday);
          endTime -= day * aday;
        } else {
          day = "00";
        }
        if (endTime >= ahourse) {
          hourse = parseInt(endTime / ahourse) + "";
          endTime -= hourse * ahourse;
        } else {
          hourse = "00";
        }
        if (endTime >= amiuate) {
          miniut = parseInt(endTime / amiuate);
          endTime -= miniut * amiuate;
        } else {
          miniut = "00";
        }
        if (endTime >= asecond) {
          second = parseInt(endTime / asecond);
        } else {
          second = "00";
        }
        this.day = day;
        this.hourse = hourse;
        this.minute = miniut;
        this.second = second;
      }
    },

    Join() {
      var user = this.$store.state.user;
      var nowAmount = this.Auction.MaxAmount;
      var amount = this.Auction.amount;
      var nowAuthor = this.Auction.MaxAuthorId;
      var nows = amount;
      if (nowAuthor.length > 0) {
        nows = nowAmount;
      }
      if (!user) {
        this.$message.error("请登录");
        return false;
      }
      var that = this;
      var id = this.auctionId;

      this.$prompt("请输入金额（现价：" + nows + ")", "参与拍卖", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: function(value) {
          var nowAmount = that.Auction.MaxAmount;
          var nowAuthor = that.Auction.MaxAuthorId;
          var amount = that.Auction.amount;
          var reg = /^[0-9]*$/;
          if (reg.test(value)) {
            if (nowAuthor.length == 0) {
              if (value <= amount) {
                return "金额必须大于起拍价";
              }
            } else {
              if (value <= nowAmount) {
                return "金额必须大于最高出价";
              }
            }
          } else {
            return "金额必须为数字";
          }
        },
        inputErrorMessage: "金额不正确"
      })
        .then(({ value }) => {
          var secret = user.secret;
          var type = 2002;
          var fee = String(0.1 * 1e8);
          var args = [id, value];
          var options = { fee: fee, type: type, args: JSON.stringify(args) };
          var trs = AschJs.dapp.createInnerTransaction(options, secret);
          return this.$http.put(
            Config.tixian,
            { transaction: trs },
            {
              headers: {
                magic: Config.magic,
                version: ""
              }
            }
          );
        })
        .then(data => data.data)
        .then(data => {
          if (data.success) {
            this.$message.success("参与成功");
            this.setBtnTimer();
          } else {
            this.$message.error(data.error);
          }
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    setBtnTimer() {
      this.loadingBtn = true;
      var time = 10;
      this.loadingTimer = setInterval(() => {
        if (time <= 0) {
          clearInterval(this.loadingTimer);
          this.loadingBtn = false;
          this.loadingBtnTxt = "10s";
        }
        time--;
        this.loadingBtnTxt = time + "s";
      }, 1000);
    }
  }
};
</script>
<style>
.auctionDetail {
  position: relative;
  z-index: 6;
  width: 850px;
  /* border: 1px solid #e9e9e9; */
  padding-left: 18px;
  overflow: hidden;
  padding-top: 10px;
}
.pm-main-1 {
  width: 450px;
  float: left;
  height: 450px;
}
.pm-main-2 {
  width: 350px;
  float: left;
  height: 300px;
  padding-left: 10px;
  padding-top: 30px;
}
.ad-price {
  display: inline-block;
  text-align: center;
  font: 700 23px tahoma;
  color: #333;
  *display: inline;
  *zoom: 1;
}
.ad-price .label,
.ad-person .label,
.ad-time .label {
  vertical-align: top;
  display: inline-block;
  position: relative;
  margin-right: 27px;
}
.ad-price .value {
  font-weight: 700;
  margin: 0 3px 0 -5px;
  font-family: arial;
  font-size: 26px;
  color: #d91615;
}
.ad-price .value {
  font-weight: 700;
  margin: 0 3px 0 -5px;
  font-family: arial;
}
.ad-price,
.ad-time,
.ad-person {
  margin-bottom: 8px;
  position: relative;
  z-index: 9;
  position: relative;
  top: 6px;
}
.ad-price .time .value em {
  margin-left: 3px;
  color: #666;
  font-weight: 400;
}
.ad-time .value var {
  display: inline-block;
  text-align: center;
  font: 700 23px tahoma;
  color: #333;
  *display: inline;
  *zoom: 1;
}
.AuctionEnd {
  background: #f3f3f3;
  color: #666;
  height: 140px;
  line-height: 70px;
  text-align: center;
  margin-top: 10px;
}
</style>
