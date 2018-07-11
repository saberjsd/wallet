<template>
    <div class="account">
        <h3>{{$t("message.account_header_first")}}</h3>
        <div class="" style="padding:10px">
          <p>{{$t("message.PersonMessage_Address")}}:{{user.address}}</p>
           <!-- <p>{{$t("message.PersonMessage_Publick")}}:{{user.publicKey}}</p> -->
        </div>
        <div class="accounts">
            <el-table :data="BanlanceArray">
                 <el-table-column
                    prop="currency"
                    :label="$t('message.account_table_currency')"
                    >
                </el-table-column>
                <el-table-column
                    prop="balance"
                     :label="$t('message.account_table_balance')"
                    >
                </el-table-column>
                <el-table-column
                     :label="$t('message.account_table_operation')">
                    <template slot-scope="scope">
                      <el-button @click="handleClick(scope.row)"  type="text" size="small">{{$t("message.account_table_t_oper_1")}}</el-button>
                      <el-button  v-if="scope.row.currency!='XAS'" @click="$router.push({name:'Trans',query:{currency:scope.row.currency}})" type="text" size="small">{{$t("message.account_table_t_oper_2")}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <h3>{{$t("message.account_header_second")}}</h3>
        <div class="accounts">
            <el-table :data="TransationArray">
                 <el-table-column
                    prop="senderId"
                    width="300"
                    :label="$t('message.account_table_senderId')"
                    >
                </el-table-column>
                <el-table-column
                    prop="time"
                    width="150"
                    :label="$t('message.account_table_time')"
                    >
                </el-table-column>
                <el-table-column
                    :label="$t('message.account_table_amounts')"
                    >
                    <template slot-scope="scope">
			                <span :style="getStyle(scope.row)">{{getFuhao(scope.row)}}{{scope.row.amount/1e8}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="recipientId"
                    width="300"
                    :label="$t('message.account_table_recipientId')"
                    >
                </el-table-column>
                <el-table-column
                    prop="t_type"
                    width="100"
                    :label="$t('message.account_table_t_type')"
                    >
                </el-table-column>
            </el-table>
            <el-pagination
      			@current-change="handleCurrentChange"
      			:current-page="pageIndex"
      			v-loading="loading"
      			:page-size="10"
      			layout="total, prev, pager, next, jumper"
      			:total="TransationTotalCount">
    		</el-pagination>
    		<el-dialog :title="$t('message.acount_form_title')" :visible.sync="dialogFormVisible">
        		<el-form @submit.native="btn_ok()" :model="form" ref="form" label-position="top" :rules="rules2">
    				<el-form-item :label="$t('message.acount_form_title1')"  prop="amount">
      					<el-input v-model="form.amount" type="number" auto-complete="off"></el-input>
    				</el-form-item>
    				<el-form-item :label="$t('message.acount_form_title2')"  prop="currency">
      					<el-select v-model="form.currency" :placeholder="$t('message.acount_form_title2')">
        					<el-option v-for="(item,index) in BanlanceArray" :key="index" :label="item.currency" :value="item.currency"></el-option>
      					</el-select>
    				</el-form-item>
  				</el-form>
  				<div slot="footer" class="dialog-footer">
    				<el-button @click="dialog_no()">{{$t("message.acount_form_btn_no")}}</el-button>
    				<el-button v-if="btn_disable" disabled>{{btn_timer}} {{$t("message.acount_form_btn_disable_1")}}</el-button>
    				<el-button v-else type="primary" @click="btn_ok()" :loading="btn_loading">{{$t("message.acount_form_btn_ok")}}</el-button>
  				</div>
			</el-dialog>
        </div>
    </div>
</template>
<script>
import Config from "../../../config/server";
import AschJs from "asch-js";
export default {
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     var user = vm.$store.state.user;
  //     if (!user) {
  //       console.log("vm", vm);
  //       vm.$router.replace("/");
  //     }
  //   });
  // },
  data() {
    var checknumber = (rule, value, callback) => {
      var amount = parseFloat(value);
      var balance = this.IsHanBanlances;
      var er = this.$t("message.acount_form_error_asset_get_0");
      if (amount > 0) {
        if (amount <= 0) {
          callback(new Error(er));
        }
        if (!balance.success) {
          callback(new Error(balance.error));
        } else {
          callback();
        }
      } else {
        callback(new Error(er));
      }
    };
    var checkbanlance = (rule, value, callback) => {
      var amount = parseFloat(this.form.amount);
      var balance = this.IsHanBanlances;
      var er = this.$t("message.acount_form_error_asset_get_0");
      if (amount >= 0) {
        if (amount <= 0) {
          callback(new Error(er));
        }
        if (!balance.success) {
          callback(new Error(balance.error));
        } else {
          callback();
        }
      } else {
        callback(new Error(er));
      }
    };
    return {
      btn_disable: false,
      btn_timer: 15,
      btn_time: null,
      user: {
        address: "",
        publicKey: ""
      },
      BanlanceArray: [],
      TransationArray: [],
      TransationTotalCount: 0,
      Types: [],
      timer: null,
      pageIndex: 1,
      loading: false,
      dialogFormVisible: false,
      btn_loading: false,
      form: {
        amount: 0,
        currency: ""
      },
      rules2: {
        amount: [{ validator: checknumber, trigger: "blur" }],
        currency: [{ validator: checkbanlance, trigger: "change" }]
      }
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
    this.getbalances();
    this.getTransation(10, 0);
    this.timer = setInterval(() => {
      this.getbalances();
      this.getTransation(10, (this.pageIndex - 1) * 10);
    }, 10000);
    if (this.$store.state.user) {
      this.user = this.$store.state.user;
    }
  },
  destroyed() {
    clearInterval(this.timer);
    clearInterval(this.btn_time);
  },
  computed: {
    IsHanBanlances() {
      var amount = parseFloat(this.form.amount);
      var asset_array = [Config.cy, "XAS"];
      var array = this.BanlanceArray.map(function(item) {
        return item;
      });
      var XAS_Index = -1;
      for (var i = 0; i < array.length; i++) {
        if (array[i].currency == "XAS") {
          XAS_Index = i;
        }
      }
      var CY_index = -1;
      for (var i = 0; i < array.length; i++) {
        if (array[i].currency == this.form.currency) {
          CY_index = i;
        }
      }
      var DDC_index = -1;
      for (var i = 0; i < array.length; i++) {
        if (array[i].currency == Config.cy) {
          DDC_index = i;
        }
      }
      var lt = this.$t("message.acount_form_error_asset_Yue_lt");
      var gt = this.$t("message.acount_form_error_asset_Yue_gt");
      if (XAS_Index < 0) {
        //查看XAS余额
        return { success: false, error: "XAS" + lt };
      } //XAS 余额大于0.1
      if (array[XAS_Index].balance < 0.1) {
        return { success: false, error: "XAS" + lt };
      }
      if (this.form.currency == "XAS") {
        if (amount > array[XAS_Index].balance - 0.1) {
          return {
            success: false,
            error: this.form.currency + gt + (array[CY_index].balance - 0.1)
          };
        }
        return { success: true };
      } else if (this.form.currency == Config.cy) {
        if (amount > array[CY_index].balance) {
          return {
            success: false,
            error: this.form.currency + gt + array[CY_index].balance
          };
        }
        return { success: true };
      } else {
        if (amount > array[CY_index].balance) {
          return {
            success: false,
            error: this.form.currency + gt + array[CY_index].balance
          };
        }
        return { success: true };
      }
    }
  },
  methods: {
    begin_timer() {
      this.btn_disable = true;
      this.btn_timer = 15;
      this.btn_time = setInterval(() => {
        if (this.btn_timer <= 0) {
          clearInterval(this.btn_time);
          this.btn_disable = false;
        }
        this.btn_timer--;
      }, 1000);
    },
    getbalances() {
      var user = this.$store.state.user;
      if (!user) {
        return false;
      }
      if (!user.hasOwnProperty("address")) {
        return false;
      }
      var address = user.address;
      this.$http
        .get(Config.balances + address)
        .then(data => data.data)
        .then(data => {
          console.log("data", data);
          if (data.success) {
            this.BanlanceArray = data.balances.map(function(item) {
              item.balance = Number(item.balance / 1e8);
              return item;
            });
            console.log("BanlanceArray", this.BanlanceArray);
          } else {
            console.error(data.error);
          }
        })
        .catch(error => {
          console.error(error.message);
        });
    },
    getTransation(limit = 10, offset = 0) {
      this.loading = true;
      var user = this.$store.state.user;
      if (!user) {
        return false;
      }
      if (!user.hasOwnProperty("address")) {
        return false;
      }
      var address = this.$store.state.user.address;
      this.$http
        .get(Config.transfers, {
          params: {
            ownerId: address,
            limit: limit,
            offset: offset
          }
        })
        .then(data => data.data)
        .then(data => {
          this.loading = false;
          console.log("data", data);
          if (data.success) {
            this.TransationArray = data.transfers.map(item => {
              item.amounts = item.amount / 1e8;
              // if (item.senderId == address) {
              //   item.senderId =
              //     item.senderId + "(" + this.$t("message.account_mine") + ")";
              // }
              // if (item.recipientId == address) {
              //   item.recipientId =
              //     item.recipientId +
              //     "(" +
              //     this.$t("message.account_mine") +
              //     ")";
              // }
              if (item.t_type == 3) {
                item.t_type = this.$t("message.account_table_type_3");
              }
              item.time = this.fullTimestamp(item.t_timestamp);
              return item;
            });
            this.TransationTotalCount = data.count;
          } else {
            console.error(data.error);
          }
        })
        .catch(error => {
          this.loading = false;
          console.error(error.message);
        });
    },
    getTypes() {
      this.$http
        .get(Config.contracts, {})
        .then(data => data.data)
        .then(data => {
          console.log("data", data);
          if (data.success) {
            this.Types = data.contracts;
          } else {
            console.error(data.error);
          }
        })
        .catch(error => {
          console.error(error.message);
        });
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getTransation(10, 10 * (val - 1));
    },
    getEpochTime(time) {
      if (time === undefined) {
        time = new Date().getTime();
      }
      var d = this.beginEpochTime();
      var t = d.getTime();
      return Math.floor((time - t) / 1000);
    },
    beginEpochTime() {
      var d = new Date(Date.UTC(2016, 5, 27, 20, 0, 0, 0));
      return d;
    },
    fullTimestamp(time) {
      var d = this.beginEpochTime();
      var t = parseInt(d.getTime() / 1000);

      d = new Date((time + t) * 1000);
      var month = d.getMonth() + 1;

      if (month < 10) {
        month = "0" + month;
      }

      var day = d.getDate();

      if (day < 10) {
        day = "0" + day;
      }

      var h = d.getHours();
      var m = d.getMinutes();
      var s = d.getSeconds();

      if (h < 10) {
        h = "0" + h;
      }

      if (m < 10) {
        m = "0" + m;
      }

      if (s < 10) {
        s = "0" + s;
      }

      return (
        d.getFullYear() + "/" + month + "/" + day + " " + h + ":" + m + ":" + s
      );
    },
    handleClick(row) {
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
      var cy_index = -1;
      var amount = row.balance;
      if (row.currency == "XAS") {
        amount = parseFloat(amount - 0.1);
      }
      this.form.amount = amount > 0 ? parseFloat(amount.toFixed(8)) : 0;
      this.form.currency = row.currency;
      this.dialogFormVisible = true;
    },
    dialog_no() {
      this.dialogFormVisible = false;
      this.$refs["form"].resetFields();
    },
    btn_ok() {
      if (this.btn_disable) {
        return false;
      }
      this.$refs["form"].validate(validat => {
        if (validat) {
          this.TiXian(this.form.amount, this.form.currency);
        }
      });
    },
    TiXian(number, currency) {
      if (number <= 0) {
        this.$message.error(this.$t("message.error_amount_gt0"));
        return false;
      }

      var secret = this.$store.state.user.secret;
      var fee = String(0.1 * 100000000);
      // var fee=String(0);
      var type = 2;
      //var currency=Config.cy;
      var amount = (number * 1e8).toFixed(0);
      if (amount.indexOf(".") >= 0) {
        amount = amount.split(".")[0];
      }
      var args = '["' + currency + '","' + amount + '"]';
      var options = { fee: fee, type: type, args: args };
      var transaction = AschJs.dapp.createInnerTransaction(options, secret);
      this.btn_loading = true;
      this.$http
        .put(
          Config.tixian,
          {
            transaction: transaction
          },
          {
            headers: {
              magic: Config.magic,
              version: ""
            }
          }
        )
        .then(data => data.data)
        .then(data => {
          this.btn_loading = false;
          if (data.success) {
            this.$message.success(
              this.$t("message.success_tixian") +
                "[" +
                number +
                " " +
                currency +
                "]"
            );
            this.dialogFormVisible = false;
            this.begin_timer();
          } else {
            this.$message.error(data.error);
          }
        })
        .catch(error => {
          this.btn_loading = false;
          this.$message.error(error.message);
        });
    },
    getStyle(row) {
      var result=""
      var address = this.user.address;
      console.log(row.senderId,row.recipientId,address)
      if (row.senderId == row.recipientId) {
        result= { color: "blue" };
      } else if (row.senderId == address) {
        result={ color: "red" };
      } else if (row.recipientId == address) {
        result={ color: "green" };
      }
      console.log("Style",result)
      return result;
    },
    getFuhao(row){
      var address = this.user.address;
      var result="";
      if (row.senderId == row.recipientId) {
        result="#";
      } else if (row.senderId == address) {
        result= "-";
      } else if (row.recipientId == address) {
        result= "+";
      }
      console.log("Fuhao1",result)
      return result;
    }
  }
};
</script>
<style>
.el-table {
  font-size: 12px;
}
.el-table td,
.el-table th {
  padding: 8px 0;
}
.account{
  width: 940px;
}
</style>
