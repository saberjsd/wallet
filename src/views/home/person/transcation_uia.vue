<template>
    <div class="uiaTrans">
        <h3>主链资产转账</h3>
        <el-form  :model="formInline" :rules="rules2" ref="form" label-position="top" class="demo-form-inline">
            <el-form-item label="地址" prop="address" >
                <el-input v-model="formInline.address" placeholder="地址"></el-input>
            </el-form-item>
            <el-form-item v-if="isSecond" label="二级密钥" prop="secondSecret" >
                <el-input type="password" v-model="formInline.secondSecret" placeholder="二级密钥"></el-input>
            </el-form-item> 
            <el-form-item label="资产" >
                <el-select v-model="formInline.currency" :placeholder="$t('message.acount_form_title2')" @change="SelectonChange">
                    <el-option v-if="uia.length==0"></el-option>
                    <el-option v-else v-for="(item,index) in uia" :key="index" :label="item.currency" :value="item.currency"></el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item label="金额(手续费为0.1 XAS)" prop="amount" >
                <el-input v-model="formInline.amount" type="number" placeholder="金额"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="message" >
                <el-input v-model="formInline.message"  placeholder="备注"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="validate()" :loading="btn_loading">转账</el-button>
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
        return callback(new Error("地址不能为空"));
      }
      if (Number.isInteger(value) || parseInt(value)) {
        return callback(new Error("地址不能为数字地址"));
      }
      var isAddress = AschJs.crypto.isAddress(value);
      if (isAddress) {
        callback();
      } else {
        callback(new Error("地址不正确"));
      }
    };
    var cheackAmount = (rule, value, callback) => {
      if (value<= 0) {
        callback(new Error("金额必须大于0"));
      }
       else {
        callback();
      }
    };
    var checkSecondSecret = (rule, value, callback) => {
      if (this.isSecond) {
        if (value.length == 0) {
          callback(new Error("二级密码不能为空"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      isSecond: false,
      dialogFormVisible:false,
      maxNum: 0,
      percision:0,
      btn_loading: false,
      formInline: {
        address: "",
        amount: 0,
        secondSecret: "",
        currency: "",
        message:""
      },
      uia: [{currency:"XAS"},{currency:Config.cy}],
      rules2: {
        address: [{ validator: checkAddress, trigger: "blur" }],
        amount: [{ validator: cheackAmount, trigger: "blur" }]
      }
    };
  },
  mounted() {
    var user = this.$store.state.user;
    if (user) {
      this.isSecond = user.secondSignature ? true : false;
    }
    var cuy=this.$route.query.cy;
    console.log("cuy",cuy)
    if(cuy=="XAS"){
      this.formInline.currency="XAS";
    }else{
      this.formInline.currency=Config.cy;
    }
    // this.getUia();
  },
  computed:{
  },
  methods: {
    SelectonChange(value){
        var uia_item=this.uia.filter(function(item){
            if(item.currency==value){
                return true;
            }else{
                return false;
            }
        });
        if(uia_item.length>0){
            this.maxNum=parseInt(uia_item[0].balanceShow);
            this.percision=parseInt(uia_item[0].precision)
        }else{
            this.maxNum=0;
            this.percision=0;
        }
        console.log(this.maxNum,this.percision)
    },
    onSubmitXAS(){
      var secret = this.$store.state.user.secret;
      var secondSecret = this.formInline.secondSecret;
      var recipientId = this.formInline.address;
      var amount = (parseFloat( this.formInline.amount) *Math.pow(10,8));
      var message=this.formInline.message;
      var trs=AschJs.transaction.createTransaction(recipientId,amount,message,secret,secondSecret|| undefined);
      this.btn_loading = true;
      this.$http
        .post(
          Config.UiaTrans,
          {
            transaction: trs
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
            this.$message.success("转账成功");
            this.formInline.address="";
            this.formInline.amount="0";
            this.formInline.secondSecret="";
            this.formInline.message="";

          } else {
            this.$message.error(data.error);
          }
        })
        .catch(error => {
          this.btn_loading = false;
          this.$message.error(error.message);
        });
    },
    onSubmit() {
      var secret = this.$store.state.user.secret;
      var secondSecret = this.formInline.secondSecret;
      var currency =Config.cy;
      var type = 3;
      var precision=8;
      var amount = (this.formInline.amount *Math.pow(10,precision)).toFixed(0);
      var message=this.formInline.message;
      var recipientId = this.formInline.address;
      var trs = AschJs.uia.createTransfer(
        currency,
        amount,
        recipientId,
        message,
        secret,
        secondSecret
      );
      this.btn_loading = true;
      this.$http
        .post(
          Config.UiaTrans,
          {
            transaction: trs
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
            this.$message.success("转账成功");
            this.formInline.address="";
            this.formInline.amount="0";
            this.formInline.secondSecret="";
            this.formInline.message="";

          } else {
            this.$message.error(data.error);
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
          if(this.formInline.currency=="XAS"){
            this.onSubmitXAS();
          }else{
            this.onSubmit();
          }
          
        }
      });
    },
    // getUia() {
    //   var user = this.$store.state.user;
    //   var address = null;
    //   if (user) {
    //     address = this.$store.state.user.address;
    //   }
    //   if (!address) {
    //     return false;
    //   }
    //   this.$http
    //     .get(Config.UiaMessage + address)
    //     .then(data => data.data)
    //     .then(data => {
    //       if (data.success) {
    //         this.uia = data.balances;
    //       } else {
    //         this.$message.error(data.error);
    //       }
    //     });
    // },
    handleClick(row) {
      this.maxNum = parseInt(row.balanceShow);
      this.percision=row.precision;

      this.dialogFormVisible=true;
      if(this.$refs["form"]){
          this.$refs["form"].resetFields();
      }     
      this.formInline.currency=row.currency;
      
    }
  }
};
</script>
<style>
.uiaTrans{
  padding: 20px;
}
.uiaTrans .el-form--label-top .el-form-item__label{
  padding-bottom: 0px !important;
  line-height:30px !important;
}
.uiaTrans .el-select{
  width: 100%;
}
</style>
