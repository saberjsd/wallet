<template>
    <div class="login">
                <div class="logo">
                    <img width="100" height="100" src="../assets/logo.png" />
                    <h1>{{$t("message.System")}}<i>BETA</i></h1>    
                </div>
                <el-form  @submit.native="submitForm('ruleForm2')" :model="ruleForm2" status-icon :rules="rules2" label-position="top" ref="ruleForm2"  class="demo-ruleForm">
                    <el-form-item :label="$t('message.Login_Lable_Secret')" prop="pass" label-width="160px">
                        <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
                    </el-form-item>

                     <el-form-item style="text-align:center">
                        <el-button :loading="btnLoading" type="primary" @click="submitForm('ruleForm2')">{{$t("message.Login_Btn_Login")}}</el-button>
                        <el-button @click="toReigester()">{{$t("message.Login_Btn_Reg")}}</el-button>
					</el-form-item> 
                </el-form>
				<el-dialog
  					:title="$t('message.Login_dialog_title')"
  					:visible.sync="dialogVisible"
  					width="50%"
  					:before-close="handleClose">
	                <el-form  :model="ruleForm3"
								ref="ruleForm3" 
                          status-icon 
                          label-position="top" 
                          class="demo-ruleForm">
                    <el-form-item :label="$t('message.Login_Lable_Secret')" prop="pass" label-width="160px">
                        <el-input id="pass" type="textarea" :rows="3"  v-model="ruleForm3.pass" auto-complete="off"></el-input>
						
                    </el-form-item>
					<p class="info">{{$t("message.Login_New_Info")}}</p>

                     <el-form-item> 
                        <el-button @click="toLogin()">{{$t("message.Login_Btn_Login1")}}</el-button>
						<el-button @click="saveAndDown()">{{$t("message.Login_Btn_Save")}}</el-button>
                     </el-form-item> 
					</el-form>
</el-dialog>
    			

                
    </div>
</template>
<script>
import Config from "../config/server";
import Aschjs from "asch-js";
import Mnemonic from 'bitcore-mnemonic';
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        var message = this.$t("message.error_secret");
        callback(new Error(message));
      } else if(!Mnemonic.isValid(value)){
          var message=this.$t("message.error_secret_notformat");
          //var message="密码不符合规范";
          callback(new Error(message));
      }else {
        callback();
      }
    };
    return {
      IsLogin: true,
      ruleForm2: {
        pass: ""
      },
      ruleForm3: {
        pass: ""
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }]
      },
      btnLoading: false,
      btnLoading2: false,
	  dialogVisible: false,
	  isSelect:false,
		Link:Config.baseUrl
    };
  },
  methods: {
    handleClose(done) {

      if (!this.isSelect) {
		  var t=this.$t("message.Login_Confirm")
        this.$confirm(t)
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }else{
		  done();
	  }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.postForm();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    postForm() {
      this.btnLoading = true;
      var publicKey = Aschjs.crypto.getKeys(this.ruleForm2.pass).publicKey;
      this.$http
        .post(Config.loginApi, { publicKey: publicKey })
        .then(data => data.data)
        .then(data => {
          this.btnLoading = false;
          if (data.success) {
            var user = {
              secret: this.ruleForm2.pass,
              publicKey: data.account.publicKey,
              address: data.account.address,
              secondSignature: data.account.secondSignature
            };
            window.localStorage.setItem("user",JSON.stringify(user))
            this.$store.dispatch("setUser", user);
            this.$router.replace("/person");
          } else {
            this.$message.error(data.error);
          }
        })
        .catch(error => {
          this.btnLoading = false;
          console.error(error.message);
        });
    },
    toReigester() {
      this.dialogVisible = true;
      this.getNewAccount();
    },
    toLogin() {
      this.dialogVisible = false;
    },
    //获取一个新账户
    getNewAccount() {
      var code = new Mnemonic(Mnemonic.Words.ENGLISH);
      this.ruleForm3.pass =code.toString();
    },
    saveAndDown() {
      this.isSelect = true;
      var Url2 = document.getElementById("pass");
      Url2.select(); // 选择对象
      document.execCommand("Copy");
      this.downloadUti(this.ruleForm3.pass, "secret.txt");
    },
    downloadUti(content, filename) {
      var date = new Date();
      var year = date.getFullYear();
      var maounth = date.getMonth() + 1;
      var day = date.getDate();
      var h = date.getHours();
      var min = date.getMinutes();
      var s = date.getSeconds();
      var time = [year, maounth, day, h, min, s];
      var filenames = filename || "dapp_" + time.join("") + ".csv";
      var eleLink = document.createElement("a");
      eleLink.download = filenames;
      eleLink.style.display = "none";
      // 字符内容转变成blob地址
      var blob = new Blob([content]);
      eleLink.href = URL.createObjectURL(blob);
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      // 然后移除
      document.body.removeChild(eleLink);
    }
  }
};
</script>
<style>
.login {
  padding-top: 100px;
  width: 400px;
  margin: 0 auto;
}
.logo {
  padding-bottom: 40px;
  text-align: center;
}
.logo > h1 > i {
  font-size: 14px;
  position: relative;
  top: -15px;
}
.info {
  margin-bottom: 10px;
  color: #aaa;
}
.demo-ruleForm {
  text-align: left;
}
</style>
