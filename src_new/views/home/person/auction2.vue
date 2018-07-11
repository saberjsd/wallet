<template>
    <div class="Auctions">
        <div v-if="Auctions.length==0">
            暂无拍卖
        </div>
        <div v-else>
            <div class="items">
                    <div class="itemWrap"
                        v-for="item in Auctions"
                        :key="item.id"
                    >
                                <router-link :to="{path:'/person/auctions/'+item.id}" class="AuctionItem">
                    <div class="header-section"></div>
                    <div class="info-section">
                            <p class="price">
                                <span class="label">当前价</span>
                                <span class="value">{{item.MaxAmount}}</span>
                                <span class="bid-tips">DDC &nbsp;(<em>{{item.addtime}}</em>次出价)</span>
                            </p>
                            <p class="time">
                                <span class="label">截至:</span>
                                <span class="value">{{item.timestamp_format}}</span>
                                <span class="bid-tips">结束</span>
                            </p>
                    </div>
                    <div class="footer-section">
                            <p class="num-auction">
                                <em>{{item.showtime}}</em>次围观
                            </p>
                            <p class="num-apply">
                                <em>{{item.jointime}}</em>人参与
                            </p>
                    </div>
                </router-link>
             </div>
            </div>

             <el-pagination
                background
                layout="total,prev, pager, next, jumper"
                 @current-change="handleCurrentChange"
                :total="Auctions.length">
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
      Auctions: []
    };
  },
  mounted() {
    this.getAuctions(0);
  },
  methods: {
    getAuctions(offset) {
      this.$http(Config.land2, {
        params: {
          status: 0,
          offset: offset
        },
        timeout: 9000
      })
        .then(data => data.data)
        .then(data => {
          if (data.success) {
            this.Auctions = data.list;
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    handleCurrentChange(val) {
        this.getAuctions(val-1);
    }
  }
};
</script>
<style>
.items{
    overflow: hidden;

}
.itemWrap{
    overflow: hidden;
    float: left;
}
.Auctions {
  margin: 20px 0 0;
  overflow: visible;
  min-height: 320px;
}
.AuctionItem {
  float: left;
  margin: 0 23px 20px 0;
  border: 2px solid #eaeaea;
  display: block;
  position: relative;
  width: 278px;
  height: 315px;
}
.AuctionItem:hover {
  border-color: red;
}
.header-section {
  display: block;
  text-align: center;
  overflow: hidden;
  position: relative;
  width: 278px;
  height: 185px;
  line-height: 180px;
}
.info-section {
  color: #999;
  display: block;
  font-size: 12px;
  padding-left: 13px;
  height: 131px;
}
.footer-section {
  zoom: 1;
  clear: none !important;
  border-top: 1px solid #eee;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 278px;
  height: 36px;
  line-height: 36px;
}
.num-auction,
.num-apply {
  color: #999;
  float: left;
  padding-left: 12px;
  width: 126px;
}
.num-auction {
  border-right: 1px solid #eee;
}
.num-auction em {
  color: #666;
  padding-right: 4px;
  font-weight: 700;
}
.num-apply em {
  color: #666;
  padding-right: 4px;
  font-weight: 700;
}
.price,
.time {
  padding-top: 10px;
  height: 30px;
  line-height: 30px;
}
.label {
  font-size: 12px;
}
.price .value {
  color: #d91615;
  padding-left: 10px;
  font-weight: 700;
  font-size: 16px;
}
.time .value {
  font-family: tahoma, "Hiragino Sans GB", "\5b8b\4f53", sans-serif;
  color: #000;
  padding-left: 10px;
  font-weight: 700;
}
</style>
