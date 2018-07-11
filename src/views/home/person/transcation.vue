<template>
    <div class="trs">
        <el-form    :model="formInline" 
                :rules="rules2" 
                ref="form" 
                label-position="top" 
                class="demo-form-inline" 
                @submit.native="validate()"
                >
            <el-form-item :label="$t('message.trs_form_field_address')" prop="address" >
                <el-input v-model="formInline.address" :placeholder="$t('message.trs_form_input_placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.trs_form_field_currency')" prop="currency" >
                <!-- <el-input v-model="formInline.currency" placeholder="资产"></el-input> -->
                <el-select v-model="formInline.currency" :placeholder="$t('message.trs_form_input_2_placeholder')">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('message.trs_form_field_amount')" prop="amount" >
                <el-input v-model="formInline.amount"  :placeholder="'余额'+ddcbalance"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="trsBtn" type="primary" :loading="btn_loading" @click="validate()">{{$t("message.trs_form_btn")}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import Config from "../../../config/server";
import AschJs from "asch-js";
export default {
  data() {
    var checkAddress = (rule, value, callback) => {
      if (!value) {
        var error = this.$t("message.trs_error_Address_NotNull");
        return callback(new Error(error));
      }
      var reg = new RegExp(/^[0-9]*$/);
      if (reg.test(value)) {
        var error = this.$t("message.trs_error_Address_NotInteger");
        return callback(new Error(error));
      }
      var isAddress = AschJs.crypto.isAddress(value);
      if (isAddress) {
        callback();
      } else {
        var error = this.$t("message.trs_error_Address_NotOk");
        callback(new Error(error));
      }
    };
    var cheackAmount = (rule, value, callback) => {
      // var reg = new RegExp(/^[0-9]*$/);
      if (Number(value)>=0) {
          callback();
      } else if (Number(value) <= 0) {
        var error = this.$t("message.trs_error_Amount_IsGt0");
        callback(new Error(error));
      } else {
        
        var error = this.$t("message.trs_error_Amount_IsNumber");
        callback(new Error(error));
      }
    };
    return {
      isSecond: false,
      btn_loading: false,
      formInline: {
        address: "",
        amount: "",
        currency: ""
      },
      options: [
        { value: "DDC", lable: "DDC" },
        // { value: "XAS", lable: "XAS" }
        ],
      rules2: {
        address: [{ validator: checkAddress, trigger: "blur" }],
        amount: [{ validator: cheackAmount, trigger: "blur" }]
      }
    };
  },
  mounted() {
    console.log(this.$route.query.currency);
    if (!this.$route.query.currency||this.$route.query.currency=="DDC") {
      this.formInline.currency = "DDC";
    }
    this.formInline.currency = "DDC";
    // else if (this.$route.query.currency == "XAS") {
    //   this.formInline.currency = "XAS";
    // }

  },
  computed:{
    ddcbalance(){
      if(this.formInline.currency=="DDC"){
        return this.$store.state.balance;
      }else if(this.formInline.currency=="XAS"){
        return this.$store.state.xasBlance;
      }
      return 0;
    }
  },
  methods: {
    onSubmit() {
      if(this.btn_loading){
        this.$message.error("加载中");
        return false;
      }
      var currency = this.formInline.currency || Config.cy;
      if(currency=="DDC"){
        currency=Config.cy;
      }
      var secret = this.$store.state.user.secret;
      var type = 2005;
      var amount = (this.formInline.amount * 1e8).toFixed(0);
      var fee = String(0.1 * 1e8);
      var address = this.formInline.address;
      var args = '["' + currency + '","' + amount + '","' + address + '"]';
      var options = { fee: fee, type: type, args: args };
      var trs = AschJs.dapp.createInnerTransaction(options, secret);
      this.btn_loading = true;
      this.$http
        .put(
          Config.tixian,
          {
            transaction: trs
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
            var error = this.$t("message.trs_info_1");
            this.$message.success(error);
            this.formInline.address="";
            this.formInline.amount="";
          } else {
            if (data.error.indexOf("Insufficient balance") > 0) {
              var error = this.$t("message.trs_info_2");
              this.$message.error(error);
            } else {
              this.$message.error(data.error);
            }
          }
        })
        .catch(error => {
          this.btn_loading = false;
          this.$message.error(error.message);
        });
    },
    validate() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.onSubmit();
        }
      });
    }
  }
};
</script>
<style>
.trs {
  max-width: 500px;
  padding:10px;
}
.trs .el-form-item__label{
  padding: 0px;
}
.trsBtn,.el-select{
  transition: all .5s ease-in-out;
}
@media screen and (max-width:768px ){
  .trs .el-select{
    width: 100%;
  }
  .trs .trsBtntrsBtn {
    width: 100%;
  }
}
</style>
