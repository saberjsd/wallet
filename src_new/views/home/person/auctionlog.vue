<template>
  <div class="AuctionLogs">
      <h4> 操作纪录</h4>
      <el-table
        :data="list"
        v-loading="loading" 
        style="width: 100%">
        <el-table-column
            prop="timestamp_format"
            label="日期"
            width="180">
        </el-table-column>
        <el-table-column
            prop="precesion"
            label="行为"
            width="180">
        </el-table-column>
        <el-table-column
            prop="LandName"
            label="地块"
            width="180">
            <template slot-scope="scope">
              <router-link class="el-button el-button--text el-button--small" :to='"/person/auctions/"+scope.row.LandId'>{{scope.row.LandName}}</router-link>
          </template>
        </el-table-column>
        <el-table-column
            label="金额"
            width="180">
            <template slot-scope="scope">
			    <span :style="getStyle(scope.row)">{{scope.row.type==101?"-":"+"}}{{scope.row.amount}}</span>
            </template>
        </el-table-column>
        <el-table-column
            prop="currency"
            label="资产">
        </el-table-column>
    </el-table>
    <el-pagination
      			@current-change="handleCurrentChange"
      			:current-page="pageIndex"
      			
      			:page-size="limit"
      			layout="total, prev, pager, next, jumper"
      			:total="count">
    </el-pagination>
  </div>
</template>

<script>
import Config from "../../../config/server";
export default {
  data() {
    return {
      list: [], //表格数据,
      count: 0,
      pageIndex: 1,
      limit: 10,
      loading: false
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
    this.getDatas(this.limit, 0);
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.type === 100) {
        return "row-in";
      } else if (row.type === 101) {
        return "row-out";
      }
      return "";
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getDatas(this.limit, this.limit * (val - 1));
    },
    getStyle(row) {
      if (row.type == 100) {
        return { color: "green" };
      } else if (row.type == 101) {
        return { color: "red" };
      } else {
        return { color: "blue" };
      }
    },
    getDatas(limit = 10, offset = 0) {
      var user = this.$store.state.user;
      if (!user) {
        return false;
      }
      this.loading = true;
      var address = user.address;
      this.$http
        .get(Config.logs, {
          params: { address: address, limit: limit, offset: offset }
        })
        .then(data => data.data)
        .then(data => {
          this.loading = false;
          if (data.success) {
            this.list = data.list;
            this.count = data.count;
          } else {
            this.$message.error(data.error);
          }
        })
        .catch(error => {
          this.loading = false;
          console.error(error);
        });
    }
  }
};
</script>

<style>
.AuctionLogs{
  padding:10px;
}
.AuctionLogs h4{
  padding:5px 0px;
}
.el-table .row-in {
  background: #72e71354;
}
.el-table .row-out {
  background: #f8aeae67;
}
</style>
