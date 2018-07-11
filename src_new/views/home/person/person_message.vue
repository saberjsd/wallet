<template>
    <div class="Children">
        <el-form
            :model="user"
            :rules="rules2"
            ref="form"
            class="form"
        >
        <el-form-item :label="$t('message.PersonMessage_Nickname')" prop="nickname">
            <el-input type="text" v-model="user.nickname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.PersonMessage_Address')" prop="address">
            <el-input type="text" v-model="user.address" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" :loading="btnLoading" @click="submitForm('ruleForm2')">提交</el-button>
            <el-button @click="resetForm('ruleForm2')">重置</el-button>
        </el-form-item>
        </el-form>
    </div>
</template>
<script>
import Config from "../../../config/server";
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
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        var value = this.$t("message.error_nickname");
        callback(new Error(value));
      } else {
        callback();
      }
    };
    return {
      user: {
        address: "",
        nickname: ""
      },
      rules2: {
        nickname: [{ validator: validatePass, trigger: "blur" }]
      },
      btnLoading: false
    };
  },
  mounted() {
    var user = this.$store.state.user;
    console.log(this.$store.state.user);
    if (user) {
      this.user.address = user.address;
      if (this.$store.state.user.extra) {
        var extra = this.$store.state.user.extra;
        var nickname =
          extra.str1 || extra.str2 || extra.str3 || extra.str4 || extra.str5;
        if (nickname.length > 0) {
          this.user.nickname = nickname;
        }
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.ChangeNickName();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    ChangeNickName() {
      this.btnLoading = true;
      var user = this.$store.state.user;
      this.$http
        .put(Config.setNickname, {
          secret: user.secret,
          fee: "10000000",
          type: 4,
          args: '["' + this.user.nickname + '"]'
        })
        .then(data => data.data)
        .then(data => {
          this.btnLoading = false;
          if (data.success) {
            this.$message.success(this.$t("message.success_ChangeNickName"));
          } else {
            console.error(data.error);
            this.$message.error(data.error);
          }
        });
    },
  }
};
</script>
<style>
.form {
  width: 300px;
  margin: 0 auto;
}
</style>
