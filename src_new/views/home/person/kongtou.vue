<template>
	<el-row>
		<el-col :span="20" :offset="2">
				<br/>
				<h1>DDC兑换说明：</h1>
				<p>支持以太币ETH和阿希币XAS，向合约地址转币兑换得到DDC。</p>
				<p style="color:red">切记：不要通过交易所账户向合约地址转币，必须使用自己的ETH或XAS钱包转币兑换DDC。</p>

				<h2>阿希币用户兑换DDC：</h2>
        <p>兑换比例: 1XAS=65DDC</p>
				<p>阿希币合约地址：ALqFfi2NeACS3AQYDBkv2WjL4e3TyWkQ3c</p>
				<p>阿希用户使用钱包向合约地址转账阿希币，系统会自动兑换DDC到用户的DDC钱包中。</p>

				<h2>以太币用户兑换DDC:</h2>
        <p>兑换比例: 1ETH=60000DDC</p>
        <p>首先用户需要创建一个DDC账户（在DDC钱包登录页点“新帐户”，并保存好主密钥，登录后在资产信息可查询到DDC地址）。</p>
        <h3>1)人工兑换DDC</h3>
				<p>以太币收币地址：0x7b2605451b56bED358bD61A82e334e0dB31d7BbC</p>
				
        <p>用户使用imToKen(仅限此钱包，其余钱包不支持)转账到收币地址并备注DDC地址。</p>
        <p style="color:red">切记：每次转账前必须将DDC地址填写到备注栏！(仅填写地址，不得填入其它多余信息，否则转账失败概不负责)。</p>
        
        <h3>2)自动兑换DDC</h3>
        <p>以太币合约地址：0x94a7583AB80acC15FA44aCa108ab8b358272815b</p>
        <p>自动兑换DDC有两步（以确保用户本人的身份）：</p>
        <p>（I）签名。</p>
        <p><router-link style="font-size:20px;color:#409EFF" to="/kongtouinfo">（以太签名获取指南）</router-link> </p>
        <p>（II）绑定<b style="color:red">(签名与绑定只需操作一次。)</b></p>
				<div class="form">
									<el-form  :model="formInline" 
                	:rules="rules2" 
                	ref="form" 
                	label-position="top" 
                  @submit.native="validate()" 
                	class="demo-form-inline" >
            		<el-form-item :label="$t('message.Kongtou_form_field_address')" prop="XASAddress" >
                		<el-input v-model="formInline.XASAddress" 
                              :suffix-icon="inputicon"
                              :placeholder="$t('message.Kongtou_form_input_placeholder')">
                    </el-input>
            		</el-form-item>
            		<el-form-item :label="$t('message.Kongtou_form_field_currency')" prop="ETHAddress" >
                		<el-input v-model="formInline.ETHAddress" :placeholder="$t('message.Kongtou_form_input_2_placeholder')"></el-input>
            		</el-form-item>
            		<el-form-item :label="$t('message.Kongtou_form_field_amount')" prop="Sign" >
                		<el-input type="textarea" :rows="10" v-model="formInline.Sign" :placeholder="$t('message.Kongtou_form_input_3_placeholder')"></el-input>
            		</el-form-item>
            		<el-form-item>
                		<el-button type="primary" :loading="btn_loading" @click="validate()"  style="width:100%">{{$t("message.Kongtou_form_btn")}}</el-button>
            		</el-form-item>
        		</el-form>
				</div>


			
		</el-col>
	</el-row>

</template>
<script>
import Config from "../../../config/server";
import AschJs from "asch-js";
export default {
  data() {
    var isJson = function(obj) {
      console.log(obj);
      // obj = new Object(obj);
      var isjson =
        typeof obj == "object" &&
        Object.prototype.toString.call(obj).toLowerCase() ==
          "[object object]" &&
        !obj.length;
      return isjson;
    };
    var checkNumber = function(obj) {
      var reg = /^[0-9]+.?[0-9]*$/;
      if (reg.test(obj)) {
        return true;
      }
      return false;
    };
    var checkAddress = (rule, value, callback) => {
      this.signDisable = false;
      if (!value) {
        var error = this.$t("message.Kongtou_error_Address_NotNull");
        return callback(new Error(error));
      }
      if (checkNumber(value)) {
        var error = this.$t("message.Kongtou_error_Address_NotInteger");
        return callback(new Error(error));
      }
      var isAddress = AschJs.crypto.isAddress(value);
      if (isAddress) {
        this.inputicon = "el-icon-loading";
        this.$http
          .post(Config.isBind, { address: value })
          .then(data => data.data)
          .then(data => {
            this.inputicon = "";
            if (data.success) {
              if (data.eth.length > 0) {
                this.formInline.ETHAddress = data.eth;
                this.signDisable = true;
                var error=this.$t("message.KontTou_error_Address_distinct")
                callback(new Error(error));
              } else {
                this.signDisable = false;
                callback();
              }
            } else {
              this.signDisable = false;
              callback();
              console.error(data.error);
            }
          })
          .catch(error => {
            console.log("error");
            this.inputicon = "";
            this.signDisable = false;
            callback(new Error(error.message));
            console.error(error);
          });
      } else {
        var error = this.$t("message.Kongtou_error_Address_NotInteger");
        return callback(new Error(error));
      }
    };
    var checkSign = (rule, value, callback) => {
      if (value == "") {
        var error = this.$t("message.KongTou_error_Sign_notNull");
        return callback(new Error(error));
      }
      var error = this.$t("message.KongTpu_error_Sign_notJson");
      var ss = JSON.parse(value);
      if (!ss) {
        return callback(new Error(error));
      } else {
        var isjson = isJson(ss);
        if (!isjson) {
          return callback(new Error(error));
        } else {
          if (ss.address && ss.msg && ss.sig && ss.version) {
            this.formInline.XASAddress = ss.msg;
            this.formInline.ETHAddress = ss.address;
            callback();
          } else {
            callback(new Error(error));
          }
        }
      }
    };
    var chechETH = (rule, value, callback) => {
      if (value == "") {
        var error = this.$t("message.Kongtou_error_ETH_NotNull");
        return callback(new Error(error));
      }
      return callback();
    };
    return {
      inputicon: "",
      isSecond: false,
      btn_loading: false,
      signDisable: false,
      formInline: {
        XASAddress: "",
        ETHAddress: "",
        Sign: ""
      },
      options: [
        { value: "XAS", lable: "XAS" },
        { value: Config.cy, lable: Config.cy }
      ],
      rules2: {
        XASAddress: [{ validator: checkAddress, trigger: "blur" }],
        Sign: [{ validator: checkSign, trigger: "blur" }],
        ETHAddress: [{ validator: chechETH, trigger: "blur" }]
      }
    };
  },
  mounted() {
    var user = this.$store.state.user;
    if (user) {
      this.formInline.XASAddress = user.address;
    }
    console.log(this.$route.query.currency);
    if (!this.$route.query.currency) {
      this.formInline.currency = Config.cy;
    } else {
      this.formInline.currency = this.$route.query.currency;
    }
    var query_currency = this.formInline.currency;
    if (query_currency != "XAS" && query_currency != Config.cy) {
      this.options.push({ value: query_currency, lable: query_currency });
    }
  },
  methods: {
    onSubmit() {
      var asch = this.formInline.XASAddress;
      var eth = this.formInline.ETHAddress;
      var sign = this.formInline.Sign;
      var sign1 = JSON.parse(sign);
      this.btn_loading = true;
      this.$http
        .post(
          Config.bind,
          {
            xctAddr: asch,
            message: sign1,
            token: eth
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
          this.btn_loading = false;
          if (data.success) {
            var error = this.$t("message.KongTou_info_1");
            this.$message.success(error);
          } else {
            this.$message.error(data.error);
          }
        })
        .catch(error => {
          this.btn_loading = false;
          this.$message.error(error.message);
        });
    },
    confirm() {
      var message=this.$t("message.KontTou_info_Confirm");
      var info1=this.$t("message.KongTou_info_Confirm_1");
      var info2=this.$t("message.KongTou_info_Confirm_2");
      var info3=this.$t("message.KongTou_info_Confirm_3");
      this.$confirm(message, info1, {
        confirmButtonText: info2,
        cancelButtonText: info3,
        type: "warning"
      })
        .then(() => {
          this.onSubmit();
        })
        .catch(() => {});
    },
    validate() {
      console.log(this.$confirm);
      this.$refs["form"].validate(valid => {
        if (valid) {
          var user = this.$store.state.user;
          if (user) {
            if (this.formInline.XASAddress != user.address) {
              this.confirm();
            } else {
              this.onSubmit();
            }
          } else {
            this.onSubmit();
          }
        }
      });
    }
  }
};
</script>
<style scoped>
.kongtou form,
.form {
  max-width: 500px;
}
.el-form--label-top .el-form-item__label {
  padding: none;
}
.info_Kontou {
  padding: 10px 15px;
}
.kongtou img {
  width: 100%;
}
h2 {
  margin: 10px 0px;
}
p {
  margin: 5px 0px;
}
.el-form--label-top .el-form-item__label{
  padding:0px 0px 0px !important;
}
</style>
