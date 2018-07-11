<template>
		<div class="account">
      
				<el-card class="box-card">
					<div slot="header" class="clearfix">
					<span>{{$t("message.account_header_first")}}</span>
          <span style="float:right;margin-left:10px">{{$t("message.account_height_time")+":"+timeShow}} </span>
          <span style="float:right">{{$t("message.account_height")+":"+Height}} </span>
          
					</div>
					<div class="accountWrap" style="padding:10px">
								<p>{{$t("message.PersonMessage_Address")}}:{{user.address}}
								</p>
								
					<div class="accounts">
						<el-row :gutter="10">
							<el-col :span=12>
								<el-card>
									<div slot="header" class="clearfix">
										 <span>{{$t("message.account_card_asset")}}</span>
									</div>
								<el-table :data="BanlanceArray">
								 <el-table-column
										prop="currency"
                    width="80"
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
													<el-tooltip class="item" effect="dark" :content='$t("message.account_tooltip_withDraw")' placement="top-start">
														<el-button @click="handleClick(scope.row)"  type="text" size="mini">{{$t("message.account_table_t_oper_1")}}</el-button>
													</el-tooltip>
													 <el-tooltip class="item" effect="dark" :content='$t("message.account_tooltip_trans")' placement="top-start">
														 <el-button @click="$router.push({name:'Trans',query:{currency:scope.row.currency}})" type="text" size="mini">{{$t("message.account_table_t_oper_2")}}</el-button>
													</el-tooltip>
										</template>
								</el-table-column>
								</el-table>
							</el-card>
						</el-col>
							<el-col :span=12>
								<el-card>
									<div slot="header" class="clearfix">
										 <span>{{$t("message.account_card_assetB")}}</span>
									</div>
								<el-table :data="AssetArray">
								 <el-table-column
										prop="currency"
                    width="80"
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
											<el-tooltip class="item" effect="dark" :content='$t("message.account_tooltip_Recharge")' placement="top-start">
												<el-button @click="showDeposeDialog(scope.row.currency)" type="text" size="mini">{{$t("message.account_table_t_oper_3")}}</el-button>
											</el-tooltip>
										</template>
								</el-table-column>
								</el-table>
							</el-card>
						</el-col>
						</el-row>

				</div>
					</div>
				</el-card>
				<el-card class="box-card">
						<div slot="header" class="clearfix">
						<span>{{$t("message.account_header_second")}}</span>
						</div>
					 <el-table :data="TransationArray">
								 <el-table-column
										prop="senderId"
										width="290"
										:label="$t('message.account_table_senderId')"
										>
								</el-table-column>
								<el-table-column
										prop="time"
										:label="$t('message.account_table_time')"
										>
								</el-table-column>
								<el-table-column
										prop="amounts"
										:label="$t('message.account_table_amounts')"
										>
								</el-table-column>
								<el-table-column
										prop="recipientId"
										width="290"
										:label="$t('message.account_table_recipientId')"
										>
								</el-table-column>
								<el-table-column
										prop="t_type"
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
				</el-card> 
				<div class="accounts">

				<el-dialog :title="$t('message.acount_form_title')" :visible.sync="dialogFormVisible">
						<el-form @submit.native="btn_ok()" :model="form" ref="form" label-position="top" :rules="rules2">
						<el-form-item :label="$t('message.acount_form_title1')"  prop="amount">
								<el-input v-model="form.amount" type="number" auto-complete="off"></el-input>
						</el-form-item>
						<el-form-item :label="$t('message.acount_form_title2')"  prop="currency">
								<el-select v-model="form.currency" :placeholder="$t('message.acount_form_title2')">
                  <el-option label="DDC" :value="Config.cy"></el-option>
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
				</div>
		</div>
</template>
<script>
import Config from "../../../config/server";
import AschJs from "asch-js";
export default {
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
        console.log(balance)
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
        console.log(balance)

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
          value=Number(value);
          var currency = this.DepositeForm.currency;
          if (currency == "XAS") {
            if (value <= parseFloat( this.Asset.XAS - 0.1).toFixed(8)) {
              callback();
            } else {
              callback("XAS "+this.$t("message.account_form_error_WithDrawl_1"));
            }
          } else {
            var balance = this.Asset.DDC;
            if (value <= balance) {
              if (this.Asset.XAS >= 0.1) {
                callback();
              } else {
                callback(new Error("XAS "+this.$t("message.account_form_error_WithDrawl_2")));
              }
            } else {
              callback(new Error(Config.cy + this.$t("message.account_form_error_WithDrawl_1")));
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
      Config:Config,
      BanlanceArray: [],
      BanlanceObj:{},
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
      },
      DepositeVisible: false, //充值
      DepositeForm: {
        secondSecret: "",
        amount: 0,
        currency: ""
      },
      DepositeOption: ["XAS", "DDC"],
      DepositeRules: {
        amount: [{ validator: checknumber2, trigger: "blur" }],
        secondSecret: [{ validator: checkbanlance2, trigger: "blur" }]
      },
      Depose_btn_loading: false,
      Depose_btn_disable: false,
      Depose_timer: 15,
      Depose_time: 0,
      Asset: { XAS: 0, DDC: 0 },
      AssetArray: [],
      Height:0,
      timeShow:"0000/00/00 00:00:00"
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
      var amount=parseFloat(this.form.amount);
      var currency=this.form.currency;
      if(currency=="XAS"){
        var balance=this.BanlanceObj.XAS;
        if(amount<=parseFloat((balance-0.1).toFixed(8))){//金额小于余额 -0.1
          return { success: true };
        }else{
          var error=this.$t("message.account_form_error_WithDrawl_1");
          return {success:false,error:"XAS "+error}
        }
      }else{
        var xasBalance=this.BanlanceObj.XAS;
        var ddcBalance=this.BanlanceObj.DDC;
        if(xasBalance<0.1){
          var error=this.$t("message.account_form_error_WithDrawl_2");
           return {success:false,error:"XAS "+error}
        }
        if(amount>ddcBalance){
          var error=this.$t("message.account_form_error_WithDrawl_1");
          return {success:false,error:"DDC "+error};
        }
        return { success: true };

      }

      // var amount = parseFloat(this.form.amount);
      // var asset_array = [Config.cy, "XAS"];
      // var array = this.BanlanceArray.map(function(item) {
      //   return item;
      // });
      // var XAS_Index = -1;
      // for (var i = 0; i < array.length; i++) {
      //   if (array[i].currency == "XAS") {
      //     XAS_Index = i;
      //   }
      // }
      // var CY_index = -1;
      // for (var i = 0; i < array.length; i++) {
      //   if (array[i].currency == this.form.currency) {
      //     CY_index = i;
      //   }
      // }
      // var DDC_index = -1;
      // for (var i = 0; i < array.length; i++) {
      //   if (array[i].currency == Config.cy) {
      //     DDC_index = i;
      //   }
      // }
      // var lt = this.$t("message.acount_form_error_asset_Yue_lt");
      // var gt = this.$t("message.acount_form_error_asset_Yue_gt");
      // if (XAS_Index < 0) {
      //   //查看XAS余额
      //   return { success: false, error: "XAS" + lt };
      // } //XAS 余额大于0.1
      // if (array[XAS_Index].balance < 0.1) {
      //   return { success: false, error: "XAS" + lt };
      // }
      // if (this.form.currency == "XAS") {
      //   if (amount > array[XAS_Index].balance - 0.1) {
      //     return {
      //       success: false,
      //       error: this.form.currency + gt + (array[CY_index].balance - 0.1)
      //     };
      //   }
      //   return { success: true };
      // } else if (this.form.currency == Config.cy) {
      //   if (amount > array[CY_index].balance) {
      //     return {
      //       success: false,
      //       error: this.form.currency + gt + array[CY_index].balance
      //     };
      //   }
      //   return { success: true };
      // } else {
      //   if (amount > array[CY_index].balance) {
      //     return {
      //       success: false,
      //       error: this.form.currency + gt + array[CY_index].balance
      //     };
      //   }
      //   return { success: true };
      // }
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
        var amount=this.Asset.XAS - 0.1>0?(this.Asset.XAS - 0.1):this.Asset.XAS
        this.DepositeForm.amount = parseFloat(
          amount.toFixed(8)
        );
      } else {
        this.DepositeForm.amount = this.Asset.DDC;
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
            var asset={XAS:0,DDC:0};
             data.balances.map(function(item) {
              if(item.currency=="XAS"){asset.XAS=Number(item.balance / 1e8);}
              else if(item.currency==Config.cy){asset.DDC=Number(item.balance / 1e8);}
              //item.balance = Number(item.balance / 1e8);
              //return item;
            });
            var tmp=[];
            for(var it in asset){
              tmp.push({currency:it,balance:asset[it]});
            }
            this.BanlanceArray=tmp;
            this.BanlanceObj=asset;
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
              var currency=item.currency==Config.cy?"DDC":item.currency
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
    handleClick(row) {//提现点击事件
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
      var currency=this.form.currency=="DDC"?Config.cy:this.form.currency;
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
      var currency = this.DepositeForm.currency=="DDC"?Config.cy:this.DepositeForm.currency,
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
              this.Asset.DDC = parseFloat(ddc.balance.balanceShow);
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
    gethHeight(){
      this.$http.get(Config.height,{timeout:10000})
      .then(data=>data.data)
      .then(data=>{
        if(data.success){
          this.Height=data.data.Height;
          this.timeShow=data.data.timestampShow;
        }else{
          console.error(data.error)
        }

        
      }).catch(error=>{
        console.error(error)
      })
    }
  }
};
</script>
<style>
.el-card {
  margin-top: 10px;
}
.el-table .cell {
  font-size: 12px;
}
</style>
