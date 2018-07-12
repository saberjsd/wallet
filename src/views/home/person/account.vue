<template>
		<div class="account">
        <div class="Asset Section">
          <div class="infomation">
            <h4>钱包信息</h4>
          </div>
          <div class="system">
            <span class="height_icon"> 
              <img class="system_icon" src="../../../assets/images/images/高度.png"/>
            </span>
            <span class="height">{{$t("message.account_height")+":"+Height}}</span>
          </div>
        </div>
        <div class="Address Section">
          <!-- <span class="Address_icon">
              <img class="system_icon" src="../../../assets/images/images/钱包.png"/>
          </span> -->
          <div class="addW">
            <span class="add">
                {{$t("message.PersonMessage_Address")}}:{{user.address}}
            </span>
            <el-button class="btnSpan" size="mini"  @click="dialogVisibleQRPri = true">私钥二维码</el-button>
            <el-button class="btnSpan" size="mini"  @click="dialogVisibleQR = true">钱包二维码</el-button>
          </div>
        </div>
        <el-row :gutter="20" class="Section">
          <el-col :span="ddcTableWidth.span" :xs="24">
            <div class="Wallet">
              <p class="Wallet_Header">{{$t("message.account_card_asset")}}</p>
              <el-card>
                <!-- <div class="toggleShow" @click="toggle_balance('USO')">
                  <img :src="showImg" alt="">
                </div> -->

								<el-table :data="BanlanceArray" class="myTable">
                    <el-table-column prop="currency" :label="$t('message.account_table_currency')" min-width="50">
                        <template slot-scope="scope">
                          <span v-if="scope.row.currency=='XAS'" class="XAS-color">{{scope.row.currency}}</span>
                          <span v-else class="USO-color">{{scope.row.currency}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="balance" :label="$t('message.account_table_balance')"  min-width="80">
                        <template slot-scope="scope">
                          <!-- <span v-if="!USOBalanceShow">********</span> -->
                          <span class="balance-style">{{scope.row.balance}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.account_table_operation')" min-width="150">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content='$t("message.account_tooltip_withDraw")' placement="top-start">
                              <el-button class="operation" @click="handleClick(scope.row)"  type="text" size="mini">{{$t("message.account_table_t_oper_1")}}</el-button>
                            </el-tooltip>
                              <el-tooltip v-if="scope.row.currency!='XAS'" class="item" effect="dark" :content='$t("message.account_tooltip_trans")' placement="top-start">
                                <el-button  class="operation" @click="$router.push({name:'Trans',query:{currency:scope.row.currency}})" type="text" size="mini">{{$t("message.account_table_t_oper_2")}}</el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>

								</el-table>
              </el-card>
            </div>
          </el-col>

          <el-col :span="ddcTableWidth.xasspan" :xs="24">
            <div class="Wallet">
              <p class="Wallet_Header">
                <el-button class="HideAssetBtn" plain @click="showAsset()">{{AssetShow?'隐藏':'显示'}}</el-button>
                <span v-show="AssetShow">阿希链</span>
              </p>
              <el-card class="transition-box">
                <!-- <div class="toggleShow" v-if="AssetShow"  @click="toggle_balance('XAS')">
                  <img :src="showImg" alt="">
                </div> -->
                <span class="main-line" v-show="!AssetShow">阿希链</span>

                <transition-group name="el-fade-in" mode="out-in">
                  <el-table key="table" v-if="AssetShow" :data="AssetArray" class="myTable">
                    <el-table-column prop="currency" :label="$t('message.account_table_currency')" min-width="50">
                      <template slot-scope="scope">
                        <span v-if="scope.row.currency=='XAS'" class="XAS-color">{{scope.row.currency}}</span>
                        <span v-else class="USO-color">{{scope.row.currency}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="balance" :label="$t('message.account_table_balance')" min-width="80">
                      <template slot-scope="scope">
                        <!-- <span v-if="!XASBalanceShow">********</span> -->
                        <span class="balance-style">{{scope.row.balance}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column min-width="150" :label="$t('message.account_table_operation')">
                      <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content='$t("message.account_tooltip_Recharge")' placement="top-start">
                          <el-button  class="operation" @click="showDeposeDialog(scope.row.currency)" type="text" size="mini">{{$t("message.account_table_t_oper_3")}}</el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark"  content='阿希链转账' placement="top-start">
                          <el-button  class="operation" @click="$router.push({name:'uiaTrans',query:{cy:scope.row.currency}})" type="text" size="mini">转账</el-button>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                  </el-table>
                </transition-group>
              </el-card>
            </div>
          </el-col>
        </el-row>


        <div class="Trans Section">
          <div class="header"> 
            <h4>交易信息</h4>
            <!-- <p>TRANSACTION INFORMATION</p> -->
          </div>
          <el-card class="box-card">
					  <el-table :data="TransationArray" class="myTable" 	v-loading="loading">
              <el-table-column prop="type" :label="$t('message.account_table_t_type')">
                <template slot-scope="scope">
                  <span v-if="scope.row.senderId.indexOf('我')> -1" style="color:red;">{{scope.row.type}}</span>
                  <span v-else style="color:#02cd1a;">{{scope.row.type}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="senderId" min-width="180" :label="$t('message.account_table_senderId')">
              </el-table-column>
              <el-table-column prop="recipientId" min-width="180" :label="$t('message.account_table_recipientId')">
              </el-table-column>
              <el-table-column prop="amounts" :label="$t('message.account_table_amounts')">
                <template slot-scope="scope">
                  <span v-if="scope.row.amounts.indexOf('USO')> -1" class="USO-color">{{scope.row.amounts}}</span>
                  <span v-else class="XAS-color">{{scope.row.amounts}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="time" min-width="100" :label="$t('message.account_table_time')">
              </el-table-column>
								
						</el-table>
						<el-pagination
            class="myPage"
						@current-change="handleCurrentChange"
						:current-page="pageIndex"
						:page-size="10"
						layout="total, prev, pager, next, jumper"
						:total="TransationTotalCount">
				    </el-pagination>
				</el-card> 
      </div>

			<div class="accounts">

				<el-dialog :title="$t('message.acount_form_title')" :visible.sync="dialogFormVisible">
						<el-form @submit.native="btn_ok()" :model="form" ref="form" label-position="top" :rules="rules2">
						<el-form-item :label="$t('message.acount_form_title1')"  prop="amount">
								<el-input v-model="form.amount" type="number" auto-complete="off"></el-input>
						</el-form-item>
						<el-form-item :label="$t('message.acount_form_title2')"  prop="currency">
								<el-select v-model="form.currency" :placeholder="$t('message.acount_form_title2')">
                  <el-option label="USO" :value="Config.cy"></el-option>
									<el-option label="XAS" value="XAS"></el-option>
								</el-select>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="dialog_no()">{{$t("message.acount_form_btn_no")}}</el-button>
						<el-button v-if="btn_disable" disabled>{{btn_timer}} {{$t("message.acount_form_btn_disable_1")}}</el-button>
						<el-button v-else type="primary" @click="btn_ok()" :loading="btn_loading">{{$t("message.acount_form_btn_ok")}}</el-button>
					</div>
			</el-dialog>
			<el-dialog :title="$t('message.account_dialog_depose_title')" :visible.sync="DepositeVisible">
						<el-form @submit.native="btn_ok_deposite()" :model="DepositeForm" ref="Deposform" label-position="top" :rules="DepositeRules">
						<el-form-item :label="$t('message.acount_form_title4')"  prop="amount">
								<el-input v-model="DepositeForm.amount" type="number" auto-complete="off"></el-input>
						</el-form-item>
						<el-form-item :label="$t('message.account_dialog_depose_lable_second')"  prop="secondSecret" v-if="$store.state.user&&$store.state.user.secondSignature">
								<el-input v-model="DepositeForm.secondSecret" type="password"  auto-complete="off" :placeholder="$t('message.error_pass')"></el-input>
						</el-form-item>
						<el-form-item :label="$t('message.acount_form_title2')"  prop="currency">
								<el-select v-model="DepositeForm.currency" :placeholder="$t('message.acount_form_title2')">
									<el-option v-for="(item,index) in DepositeOption" :key="index" :label="item" :value="item"></el-option>
								</el-select>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="DepositeVisible=false">{{$t("message.acount_form_btn_no")}}</el-button>
						<el-button v-if="Depose_btn_disable" disabled>{{Depose_timer}} {{$t("message.acount_form_btn_disable_1")}}</el-button>
						<el-button v-else type="primary" @click="btn_ok_deposite()" :loading="Depose_btn_loading">{{$t("message.acount_form_btn_ok")}}</el-button>
					</div>
			</el-dialog>

      <el-dialog
          :visible.sync="dialogVisibleQR">
          <div class="myQrBody">
            <vue-qr :text="user.address"  class="myQr" :logoSrc="logoSrc" :margin="10" :dotScale="0.8" colorDark="#333"></vue-qr>
            <p style="text-align:center"> 钱包地址</p>
          </div>
          
      </el-dialog>
            <el-dialog
          :visible.sync="dialogVisibleQRPri">
          <div class="myQrBody">
            <vue-qr :text="user.secret"  class="myQr" :logoSrc="logoSrc" :margin="10" :dotScale="0.8" colorDark="#333"></vue-qr>
            <p style="text-align:center"> 私钥为登录钱包唯一凭证，请妥善保管，切勿分享</p>
          </div>
          
      </el-dialog>
				</div>
		</div>
</template>
<script>
import Config from "../../../config/server";
import AschJs from "asch-js";
import VueQr from "vue-qr";
export default {
  components: {
    VueQr
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      var user = vm.$store.state.user;
      if (!user) {
        console.log("vm", vm);
        vm.$router.replace("/");
      }
    });
  },
  data() {
    var checknumber = (rule, value, callback) => {
      var amount = parseFloat(value);

      var er = this.$t("message.acount_form_error_asset_get_0");
      if (amount > 0) {
        if (amount <= 0) {
          callback(new Error(er));
        }
        var balance = this.IsHanBanlances;
        console.log(balance);
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

      var er = this.$t("message.acount_form_error_asset_get_0");
      if (amount >= 0) {
        if (amount <= 0) {
          callback(new Error(er));
        }
        var balance = this.IsHanBanlances;
        console.log(balance);

        if (!balance.success) {
          callback(new Error(balance.error));
        } else {
          callback();
        }
      } else {
        callback(new Error(er));
      }
    };
    var checknumber2 = (rule, value, callback) => {
      var reg = /^\/\/d+(\/\/.\/\/d+)?$/;
      if (parseFloat(value) >= 0) {
        if (parseFloat(value) <= 0) {
          callback(new Error(this.$t("message.acount_form_error_asset_get_0")));
        } else {
          value = Number(value);
          var currency = this.DepositeForm.currency;
          if (currency == "XAS") {
            if (value <= parseFloat(this.Asset.XAS - 0.1).toFixed(8)) {
              callback();
            } else {
              callback(
                "XAS " + this.$t("message.account_form_error_WithDrawl_1")
              );
            }
          } else {
            var balance = this.Asset.USO;
            if (value <= balance) {
              if (this.Asset.XAS >= 0.1) {
                callback();
              } else {
                callback(
                  new Error(
                    "XAS " + this.$t("message.account_form_error_WithDrawl_2")
                  )
                );
              }
            } else {
              callback(
                new Error(
                  Config.cy + this.$t("message.account_form_error_WithDrawl_1")
                )
              );
            }
          }
          callback();
        }
      } else {
        callback(new Error(this.$t("message.acount_form_error_asset_get_0")));
      }
    };
    var checkbanlance2 = (rule, value, callback) => {
      var user = this.$store.state.user;
      if (user) {
        if (user.secondSignature) {
          //如果存在
          var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error(this.$t("message.error_pass")));
          }
        } else {
          callback();
        }
      } else {
        callback(new Error("用户不存在"));
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
      Config: Config,
      BanlanceArray: [],
      BanlanceObj: {},
      TransationArray: [],
      transactionArray: [],
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
      },
      DepositeVisible: false, //充值
      DepositeForm: {
        secondSecret: "",
        amount: 0,
        currency: ""
      },
      DepositeOption: ["XAS", "USO"],
      DepositeRules: {
        amount: [{ validator: checknumber2, trigger: "blur" }],
        secondSecret: [{ validator: checkbanlance2, trigger: "blur" }]
      },
      Depose_btn_loading: false,
      Depose_btn_disable: false,
      Depose_timer: 15,
      Depose_time: 0,
      Asset: { XAS: 0, USO: 0 },
      AssetArray: [],
      AssetShow: false,
      Height: 0,
      timeShow: "0000/00/00 00:00:00",

      dialogVisibleQR: false,
      dialogVisibleQRPri: false,
      logoSrc:require("../../../assets/qrcode.png"),

      USOBalanceShow:false,
      XASBalanceShow:false,
      showImg:'../../../assets/img/index_visible_2.png'
    };
  },
  mounted() {
    this.getbalances();
    this.gethHeight();
    this.getTransation(10, 0);
    this.getAsset();
    this.timer = setInterval(() => {
      this.getbalances();
      this.gethHeight();
      this.getTransation(10, (this.pageIndex - 1) * 10);
      this.getAsset();
    }, 20000);
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
      var currency = this.form.currency;
      if (currency == "XAS") {
        var balance = this.BanlanceObj.XAS;
        if (amount <= parseFloat((balance - 0.1).toFixed(8))) {
          //金额小于余额 -0.1
          return { success: true };
        } else {
          var error = this.$t("message.account_form_error_WithDrawl_1");
          return { success: false, error: "XAS " + error };
        }
      } else {
        var xasBalance = this.BanlanceObj.XAS;
        var ddcBalance = this.BanlanceObj.USO;
        if (xasBalance < 0.1) {
          var error = this.$t("message.account_form_error_WithDrawl_2");
          return { success: false, error: "XAS " + error };
        }
        if (amount > ddcBalance) {
          var error = this.$t("message.account_form_error_WithDrawl_1");
          return { success: false, error: "USO " + error };
        }
        return { success: true };
      }
    },
    ddcTableWidth() {
      if (this.AssetShow) {
        //展开状态
        return { span: 12, xasspan: 12 };
      } else {
        return { span: 22, xasspan: 2};
      }
    }
  },
  methods: {
    showAsset() {
      this.AssetShow = !this.AssetShow;
    },
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
    Depose_begin_timer() {
      this.Depose_btn_disable = true;
      this.Depose_timer = 15;
      this.Depose_time = setInterval(() => {
        if (this.Depose_timer <= 0) {
          clearInterval(this.Depose_time);
          this.Depose_btn_disable = false;
        }
        this.Depose_timer--;
      }, 1000);
    },
    showDeposeDialog(currency) {
      if (this.$refs["Deposform"]) {
        this.$refs["Deposform"].resetFields();
      }
      this.DepositeVisible = true;
      this.DepositeForm.currency = currency;
      if (currency == "XAS") {
        var amount =
          this.Asset.XAS - 0.1 > 0 ? this.Asset.XAS - 0.1 : this.Asset.XAS;
        this.DepositeForm.amount = parseFloat(amount.toFixed(8));
      } else {
        this.DepositeForm.amount = this.Asset.USO;
      }
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
            // var asset=[{currency:"XAS",balance:0},{currency:Config.cy}];
            var asset = { XAS: 0, USO: 0 };
            data.balances.map(item => {
              if (item.currency == "XAS") {
                asset.XAS = Number(item.balance / 1e8);
                this.$store.dispatch("setXASBalance", asset.XAS);
              } else if (item.currency == Config.cy) {
                asset.USO = Number(item.balance / 1e8);
                this.$store.dispatch("setBalance", asset.USO);
              }
              //item.balance = Number(item.balance / 1e8);
              //return item;
            });
            var tmp = [];
            for (var it in asset) {
              tmp.push({ currency: it, balance: asset[it] });
            }
            this.BanlanceArray = tmp;
            this.BanlanceObj = asset;
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
            this.TransationArray = data.transfers
              .sort(function(a, b) {
                return b.timestamp - a.timestamp;
              })
              .map((item, index) => {
                var currency =
                  item.currency == Config.cy ? "USO" : item.currency;
                item.amounts = item.amount / 1e8 + " " + currency;
                if (item.senderId == address) {
                  item.senderId =
                    item.senderId + "(" + this.$t("message.account_mine") + ")";
                }
                if (item.recipientId == address) {
                  item.recipientId =
                    item.recipientId +
                    "(" +
                    this.$t("message.account_mine") +
                    ")";
                }
                if (item.type == 3 || item.type == 2005) {
                  item.type = this.$t("message.account_table_type_3");
                }
                item.time = this.fullTimestamp(item.timestamp);
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
    setTransactionArray() {
      this.getTransation(10, 10 * (this.pageIndex - 1));
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.setTransactionArray();
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
      //提现点击事件
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
      var amount = row.balance;
      if (row.currency == "XAS") {
        amount = parseFloat(amount - 0.1);
      }
      this.form.amount = amount > 0 ? parseFloat(amount.toFixed(8)) : 0;
      this.form.currency = row.currency;
      this.dialogFormVisible = true;
    },
    dialog_no() {
      //提现按钮点击取消事件
      this.dialogFormVisible = false;
      this.$refs["form"].resetFields();
    },
    btn_ok() {
      //提现点击确认事件
      if (this.btn_disable) {
        return false;
      }
      var currency =
        this.form.currency == "USO" ? Config.cy : this.form.currency;
      this.$refs["form"].validate(validat => {
        if (validat) {
          this.TiXian(this.form.amount, currency);
        }
      });
    },
    btn_ok_deposite() {
      if (this.Depose_btn_disable) {
        return false;
      }
      this.$refs["Deposform"].validate(validat => {
        if (validat) {
          this.Deposite();
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
    Deposite() {
      var dappid = Config.dappid;
      var currency =
          this.DepositeForm.currency == "USO"
            ? Config.cy
            : this.DepositeForm.currency,
        amount = parseFloat(this.DepositeForm.amount) * 1e8,
        secret = this.$store.state.user.secret,
        secondSecret = undefined;
      if (this.$store.state.user && this.$store.state.user.secondSignature) {
        secondSecret = this.DepositeForm.secondSecret;
      }
      var transaction = AschJs.transfer.createInTransfer(
        dappid,
        currency,
        amount,
        secret,
        secondSecret
      );
      this.Depose_btn_loading = true;
      this.$http
        .post(
          Config.aschTrans,
          {
            transaction: transaction
          },
          {
            headers: {
              magic: Config.magic,
              version: ""
            },
            timeout: 10000
          }
        )
        .then(data => data.data)
        .then(data => {
          this.Depose_btn_loading = false;
          if (data.success) {
            this.$message.success("充值成功");
            this.DepositeVisible = false;
            this.Depose_begin_timer();
            this.DepositeForm.amount = 0;
            this.DepositeForm.secondSecret = "";
          } else {
            this.$message.error(data.error);
          }
        })
        .catch(error => {
          this.Depose_btn_loading = false;
          this.$message.error(error.message);
        });
    },
    getAsset() {
      var user = this.$store.state.user;
      if (!user) {
        return false;
      }
      if (!user.hasOwnProperty("address")) {
        return false;
      }
      var address = user.address;
      this.$http
        .all([
          this.$http.get(Config.asset + address + "/" + Config.cy),
          this.$http.get(Config.xas, {
            params: {
              address: address
            }
          })
        ])
        .then(
          this.$http.spread((ddc, xas) => {
            ddc = ddc.data;
            xas = xas.data;
            if (xas.success) {
              this.Asset.XAS = parseFloat((xas.balance / 1e8).toFixed(8));
              //this.AssetArray.push({currency:"XAS",balance:this.Asset.XAS})
            }
            if (ddc.success) {
              this.Asset.USO = parseFloat(ddc.balance.balanceShow);
              //this.AssetArray.push({currency:Config.cy,balance:this.Asset.DDC})
            }
            var arry = [];
            for (var item in this.Asset) {
              arry.push({
                currency: item,
                balance: this.Asset[item]
              });
            }
            this.AssetArray = arry;
          })
        )
        .catch(error => {
          console.error(error.message);
        });
    },
    gethHeight() {
      this.$http
        .get(Config.height, { timeout: 10000 })
        .then(data => data.data)
        .then(data => {
          if (data.success) {
            this.Height = data.height;
          } else {
            console.error(data.error);
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    toggle_balance(type){
      if(type=='USO'){
        this.USOBalanceShow = !this.USOBalanceShow
        if(this.USOBalanceShow){
          this.showImg = '../../../assets/img/index_visible_2.png'
        }else{
          this.showImg = '../../../assets/img/index_invisible_2.png'
        }
      }else if(type=='XAS'){
        this.XASBalanceShow = !this.XASBalanceShow
        if(this.XASBalanceShow){
          this.showImg = '../../../assets/img/index_visible_2.png'
        }else{
          this.showImg = '../../../assets/img/index_invisible_2.png'
        }
      }
    }
  }
};
</script>
<style>
.el-card {
  margin-top: 10px;
}
.Asset {
  width: 100%;
  margin-top: 20px;
  position: relative;
  overflow: hidden;
}
.Asset .infomation {
  color: #949bc7;
  float: left;
  margin-bottom: 20px;
}
.Asset .infomation h4,.Trans .header h4 {
  font-size: 28px;
  color: #333;
  line-height: 50px;
  border-left: 6px solid #57c586;
  padding-left: 10px;
}
.Asset .system {
  float: right;
  color: #c4c3c3;
  font-size: 20px;
  padding: 10px 0px;
}
.Asset .system .system_icon {
  position: relative;
  top: 6px;
}
.Asset .system .split {
  margin: 0 10px;
}
.Address {
  height: 60px;
  border-radius: 5px;
  background: #57c586;
  color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  white-space: nowrap;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.Address .Address_icon {
  margin: 0 40px;
}
.Address .system_icon {
  margin-top: 5px;
}
.Address .addW{
  width: 850px;
  height: 60px;
  margin: 0 auto;
  line-height: 60px;
}
.Address .add{
  font-size: 22px;
  color: #fff;
}
.addW .add{
  float: left;
  height: 60px;
  line-height: 60px;
  letter-spacing: 2px;
  white-space: nowrap;
  margin-right: 20px;
}
.btnSpan > button {
  /* dis */
  float: left;
  margin-top: 15px;
  margin-left: 10px;
}
.Wallet {
  margin-top: 10px;
  margin-bottom: 10px;
}
.Wallet_Header {
  line-height: 21px;
  font-size: 18px;
  color: #666666;
}
.Wallet_Header button{
  padding: 2px 5px;
}
.Wallet .el-button {
  font-size: 22px;
  color: #536ff1;
}
.myTable .cell {
  font-size: 22px;
  color: #3a4062;
}

.Section .el-card__body {
  padding: 10px 0 0 0;
}
.myTable .el-table__header-wrapper .cell {
  font-size: 24px;
  color: #333333;
  text-align: center;
}
.el-table--enable-row-transition .el-table__body td{
  text-align: center;
}
.Section .el-card{
  position: relative;
}
.toggleShow{
  position: absolute;
  width: 30px;
  height: 22px;
  top: 20px;
  right: 20px;
  z-index: 99;
  cursor: pointer;
}
.toggleShow img{
  display: inline-block;
  width: 30px;
  height: 21px;
}
.main-line{
  position: absolute;
  width: 20px;
  height: 120px;
  top: 30px;
  right: 26px;
  z-index: 99;
  font-size: 20px;
  line-height: 24px;
}


.Trans .cell {
  font-size: 14px;
}
.Trans .header {
  margin-top: 10px;
}

.Trans .header p {
  font-size: 16px;
  color: #949bc7;
}
.Trans .el-table__header-wrapper {
  border-bottom: 1px solid #57c586;
}
.Trans {
  margin-bottom: 40px;
}
.myPage {
  padding: 10px;
  text-align: center;
}
.myPage button,
.myPage span:not([class*="suffix"]) {
  font-size: 22px;
  /* color: #57c586; */
}
.myPage .el-pager li {
  font-size: 22px;
}
.myPage .el-pager li.active,
.myPage .el-pager li:hover {
  color: #57c586;
}
.balance-style{
  font-size: 18px;
  color: #656565;
}
.XAS-color {
  color: #f9a527;
}
.USO-color {
  color: #6ddc9c;
}
.operation span{
  color: #1691b6;
}


.myQrBody{
  min-height: 200px;
}

.transition-box {
  min-height: 183px;
}
.ShowAssetBtn {
  margin-top: 44px;
  margin-left: calc(50% - 44px);
}
.HideAssetBtn {
  /* padding: 0px !important; */
  /* background:  */
  border-color: #57c586 !important;
  font-size: 16px !important;
  color: #57c586 !important;
}
.HideAssetBtn:hover{
  border-color: #43df86 !important;
  color: #57c586 !important;
}
.myQr {
  text-align: center;
}
.el-dialog__headerbtn {
  font-size: 35px;
}
@media screen and (max-width: 768px) {
  .Address .add {
    font-size: 12px;
  }
  .Address > span{
    float:none;
  }
  .Address > span.add {
    height: 50px;
    line-height: 50px;
    display: block;
  }
  .Address_icon {
    display: none;
  }
  .Asset .infomation {
    display: block;
    width: 100%;
  }
  .Asset .system {
    display: block;
    width: 100%;
    float: none;
  }
  .transition-box {
    min-height: 50px;
    /* text-align: center; */
    /* line-height: 150px; */
    /* text-align: center; */
  }
  .ShowAssetBtn {
    margin-top: 0px;
    margin-left: calc(50% - 44px);
  }
  .myQr img {
    width: 80%;
  }
  .Address .btnSpan {
    line-height: unset;
    width: 300px;
    display: block;
    height: 50px;
  }
}
</style>
