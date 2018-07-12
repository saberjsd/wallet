<template>
    <div class="loginwrap">
      <div class="loginTop">
        <img src="../assets/img/login_logo_bg.png"/>
      </div>
      <!-- <div class="login">
                <div class="logo">
                  <div class="logoWrap">
                    <img width="190" height="190" src="../assets/ddclogo.png" />
                  </div>
                </div>
                <h1>{{$t("message.System")}}
                  <i style="font-style:normal">BETA</i>
                  </h1>   
                <el-form  @submit.native="submitForm('ruleForm2')" :model="ruleForm2" status-icon :rules="rules2" label-position="top" ref="ruleForm2"  class="demo-ruleForm">
                    <el-form-item 
                    
                    prop="pass" 
                    label-width="160px">
                        <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
                    </el-form-item>

                     <el-form-item style="text-align:center">
                        <el-button class="loginBtn" :loading="btnLoading" style="width: 100%;" type="primary" @click="submitForm('ruleForm2')">{{$t("message.Login_Btn_Login")}}</el-button>
                        
					          </el-form-item> 

                    <el-form-item style="text-align:center">
                      <el-button class="newAccountBtn" @click="toReigester()" style="width: 100%;">{{$t("message.Login_Btn_Reg")}}</el-button>
                    </el-form-item> 

                </el-form>
				<el-dialog
  					:title="$t('message.Login_dialog_title')"
  					:visible.sync="dialogVisible"
  					:before-close="handleClose">
	                <el-form  :model="ruleForm3"
								          ref="ruleForm3" 
                          status-icon 
                          label-position="top" 
                          class="dialog-ruleForm">
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
      </div>           -->
      <div class="login" v-if="isReg">
        <div class="logo_img">
          <img src="../assets/img/login_logo_mini.png"/>
        </div>
        <div class="logo_title">
          <p>USO 在线钱包</p>
        </div>
        <div class="logo_right">
          <img src="../assets/img/text_LOGIN.png"/>
        </div>
        <div class="logo_welcome">
          <p>欢迎回来</p>
        </div>
        <div class="logo_please">
          <p>请在下方登录您的钱包</p>
        </div>
          <el-form  @submit.native="submitForm('ruleForm2')" :model="ruleForm2" status-icon :rules="rules2" label-position="top" ref="ruleForm2"  class="ruleForm">
                    <el-form-item 
                      prop="pass" 
                      label-width="160px"
                      label="请输入主密钥（12位助记词）"
                      >
                        <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
                    </el-form-item>

                     <el-form-item style="text-align:center">
                        <el-button class="mybtn loginBtn" :loading="btnLoading"  type="primary" @click="submitForm('ruleForm2')">{{$t("message.Login_Btn_Login")}}</el-button>
                        <el-button class="mybtn newAccountBtn" @click="toReigester()">{{$t("message.Login_Btn_Reg")}}</el-button>
                    </el-form-item> 

          </el-form>
      </div>
      <div class="login" v-else>
        <div class="logo_img">
          <img src="../assets/img/login_logo_mini.png"/>
        </div>
        <div class="logo_title">
          <p>USO 钱包</p>
        </div>
        <div class="logo_right">
          <img src="../assets/img/text_LOGIN.png"/>
        </div>
        <div class="logo_welcome">
          <p>创建主密钥</p>
        </div>
          <el-form        :model="ruleForm3"
								          ref="ruleForm3" 
                          status-icon 
                          label-position="top" 
                          class="ruleForm">
                          <el-form-item :label="$t('message.Login_Lable_Secret')" prop="pass" label-width="160px">
                            <el-input id="pass" type="textarea" :rows="3" :readonly="true"  v-model="ruleForm3.pass" auto-complete="off"></el-input>
                          </el-form-item>
					                <p class="info">{{$t("message.Login_New_Info")}}</p>

                          <el-form-item> 
                            <el-button @click="toLogin()"     class="mybtn loginBtn">{{$t("message.Login_Btn_Login1")}}</el-button>
						                <el-button @click="saveAndDown()" class="mybtn newAccountBtn">{{$t("message.Login_Btn_Save")}}</el-button>
                          </el-form-item> 
				  </el-form>
      </div>
    </div>
</template>
<script>
import Config from "../config/server";
import Aschjs from "asch-js";
import Mnemonic from "bitcore-mnemonic";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        var message = this.$t("message.error_secret");
        callback(new Error(message));
      } else if (!Mnemonic.isValid(value)) {
        var message = this.$t("message.error_secret_notformat");
        //var message="密码不符合规范";
        callback(new Error(message));
      } else {
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
      isSelect: false,
      Link: Config.baseUrl,
      isReg:true
    };
  },
  methods: {
    handleClose(done) {
      if (!this.isSelect) {
        var t = this.$t("message.Login_Confirm");
        this.$confirm(t)
          .then(_ => {
            done();
          })
          .catch(_ => {});
      } else {
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
      // this.dialogVisible = true;
      this.resetForm("ruleForm2")
      this.getNewAccount();
      this.isReg=!this.isReg
    },
    toLogin() {      
      var Url2 = document.getElementById("pass");
      Url2.select(); // 选择对象
      document.execCommand("Copy");
      this.resetForm("ruleForm3")      
      this.isReg=!this.isReg;
      setTimeout(()=>{
        this.resetForm("ruleForm2")
      },10)
      
    },
    //获取一个新账户
    getNewAccount() {
      var code = new Mnemonic(Mnemonic.Words.ENGLISH);
      this.ruleForm3.pass = code.toString();
    },
    saveAndDown() {
      this.isSelect = true;
      var Url2 = document.getElementById("pass");
      Url2.select(); // 选择对象
      document.execCommand("Copy");
      var publicKey= Aschjs.crypto.getKeys(this.ruleForm3.pass).publicKey;
      var address=Aschjs.crypto.getAddress(publicKey)
      var string=`
==============secret==============\n\r
\n\r
${this.ruleForm3.pass}\n\r
\n\r
==============publicKey==============\n\r
\n\r
${publicKey}\n\r
\n\r
==============address==============\n\r
\n\r  
${address}\n\r
\n\r
      `
      var name="secret."+address+".txt"
      this.downloadUti(string, name);
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
.loginwrap{
  margin: 0px auto;
  position: relative;
    padding-top: 225px;
}
.loginTop{
    position: absolute;
    top: 50px;
    left: calc(50% - 568px);
}
.login{
  width:650px;
  height:500px;
  margin: 0px auto;
  background: url("../assets/img/login_1_bg.png") no-repeat ;
  background-color: #fff;
  position: relative;
  box-shadow: 0 0 44px 3px rgba(0, 0, 0, 0.1);
  border-radius: 10px;

}
.login .logo_img{
    position: absolute;
    height:50px;
    width: 57px;
    left: 10px;
    top: 10px;

}
.login .logo_img img{
    height:57px;
    width: 75px;
}
.login .logo_title{
  position: absolute;
  top: 10px;
  left:87px;
  height: 57px;
  line-height: 57px;
  font-size: 24px;
  font-weight: 600;
  color: #fff;
}
.login .logo_right{
  position: absolute;
  top: 40px;
  right: 100px;
}
.login .logo_welcome{
  position: absolute;
  font-size: 38px;
  color:#656565;
  left: 40px;
  top: 94px;
}
.login .logo_please{
  position: absolute;
  font-size: 24px;
  color:#656565;
  right: 50px;
  top: 133px;
}
.login .ruleForm{
  position: absolute;
  top: 210px;
  width:550px;
  left: 50px;
}
.login .ruleForm .el-form-item__label{
  font-size: 18px;
  color:#333;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif
}
.login .ruleForm .el-input__inner{
  height: 80px;
  font-size: 40px;
}
.login .ruleForm .el-input:focus,
.login .ruleForm .el-input__inner:focus
.login .ruleForm .el-textarea__inner:focus,
.login .ruleForm .el-textarea__inner:focus
{
  border-color: #6ddc9c;
}
.login .mybtn{
  width: 250px;
  height: 60px;
  font-size: 24px;
  border-radius: 6px;
}
.login .mybtn:hover{
  background-color: #6ddc9c;
  border-color: #6ddc9c;
  color: #fff;
}

.login .mybtn.loginBtn{
  background-color: #6ddc9c;
  border-color: #6ddc9c;
  color: #fff;
}
.login .mybtn.newAccountBtn:focus{
    background-color: #6ddc9c;
    border-color: #6ddc9c;
    color: #fff;
}
.login .el-button+.el-button{
  margin-left: 44px;
}
.login .info{
  font-size: 16px;
    color: #999;
    margin-bottom: 10px;
}
/* .loginwrap {
  /* //height: calc(100% - 80px); */
  /* margin-top: 15vh;
}
.login {
  max-width: 580px;
  height: 435px;
  padding: 10px;
  background: #fff;
  border-radius: 5px;
  margin: 0 auto;
  position: relative;
  top: calc(50% - 200px);
}
.logo {
  text-align: center;
  position: absolute;
  margin-top: -100px;
  margin-left: calc(50% - 100px);
}
.loginBtn {
  background: #108787 !important;
  color: #fff;
  font-size: 20px;
  height: 60px;

  border-color: #108787 !important;
}
.newAccountBtn {
  color: #108787 !important;
  font-size: 20px;
  height: 60px;
  border-color: #108787 !important;
}
.login .el-input__inner {
  font-size: 20px;
  height: 60px;
  line-height: 60px;
}
.login .el-input__inner:focus {
  border-color: #108787 !important;
}
.login .demo-ruleForm {
  margin-top: 145px;
}
.dialog-ruleForm {
  /* position:absolute; */
  /* margin-bottom:44px;
  width: calc(100% - 88px); 
}
.login > h1 {
  text-align: center;
  position: relative;
  font-size: 36px;
  color: #0e525c;
  top: 90px;
}
.login > h1 i {
  font-style: normal !important;
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
@media screen and (max-width: 768px) {
  .loginwrap {
    margin-top: 0px;
  }
  .login {
    padding: 10px;
    border-radius: 5px;
  }
  .login .demo-ruleForm {
    /* margin-top: 145px; 
    bottom: 10px;
    width: calc(100% - 20px);
  }
} */
</style>
