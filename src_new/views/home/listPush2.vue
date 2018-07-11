<template>
    <div>
        <el-form  :model="formInline" class="demo-form-inline" style="width:400px;">
            <el-form-item label="地址">
                <el-input v-model="formInline.address" placeholder="地址"></el-input>
            </el-form-item>
            <el-form-item label="密钥">
                <el-input v-model="formInline.secret" type="password" placeholder="密钥"></el-input>
            </el-form-item>
            <el-form-item label="金额">
                <el-input v-model="formInline.amount" type="number" placeholder="金额"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">转账</el-button>
            </el-form-item>
        </el-form>
        <h3>批量转账</h3>
        <el-row style="padding:30px 10px">
            <el-col :span="6">
                <el-button @click="handleClick2" size="mini" :loading="checkLoading">校验地址</el-button>
                <el-button type="primary" @click="dialogVisible=true" :loading="tranLoading" size="mini" :disabled="this.textarea2.length<=0">转账({{Account}})</el-button>
				
                <el-button size="mini" @click="handleClick_clear1()">清空</el-button>
                <el-input
                    type="textarea" :disabled="tranLoading"
                    :autosize="{ minRows: 25}"
                    placeholder="请输入内容"
                    v-model="textarea2"></el-input>
                </el-col>
            <el-col :span="12" style="padding:10px">
                <p>本地重复项[{{table1.length}}]<el-button size="mini" @click="downLoad2()">下载</el-button></p>
                <el-table
                    :data="table1"
                    border
                    height="250"
                    style="width: 100%">
                    <el-table-column
                        fixed
                        prop="address"
                        label="地址">
                    </el-table-column>
                    <el-table-column
                        prop="amount"
                        label="金额"
                        width="120">
                    </el-table-column>
					<el-table-column
                        prop="currency"
                        label="币种"
                        width="140">
                    </el-table-column>
                </el-table>
                <p>服务端重复项[{{table2.length}}] <el-button size="mini" @click="downLoad3()">下载</el-button></p>
                <el-table
                    :data="table2"
                    border
                    height="250"
                    style="width: 100%">
                    <el-table-column
                        fixed
                        prop="address"
                        label="地址">
                    </el-table-column>
                    <el-table-column
                        prop="amount"
                        label="金额"
                        width="120">
                    </el-table-column>
					<el-table-column
                        prop="currency"
                        label="币种"
                        width="140">
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="6">
                <el-button size="mini" @click="downLoad()">下载</el-button>
                <el-button size="mini" @click="handleClick_clear2()">清空</el-button>
                <el-input
                    type="textarea"
                    :autosize="{ minRows:25}"
                    v-model="textarea3" :disabled="true"></el-input>
                
            </el-col>
			<el-col :span="24">
				<p>错误信息</p>
                <el-button size="mini" @click="downLoad1()">下载</el-button>
                <el-button size="mini" @click="handleClick_clear3()">清空</el-button>
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 15}"
                    v-model="textarea4" :disabled="true"></el-input>
                
            </el-col>
        </el-row>
		<el-dialog
  			title="提示"
  			:visible.sync="dialogVisible"
  			width="30%">
  			<span>是否去重？</span>
  			<span slot="footer" class="dialog-footer">
    			<el-button @click="ToDis(true)" type="warning">取 消</el-button>
    			<el-button type="primary" @click="ToDis(false)">确 定</el-button>
  			</span>
		</el-dialog>
  </div>
</template>
<script>
import Config from "../../config/server";
export default {
  data() {
    return {
      table1: [],
      table2: [],
      filesArray: [],
      timer: null,
      config: Config,
      checkLoading: false,
      dialogVisible: false,
      tranLoading: false,
      fileList3: [],
      textarea2: "",
      textarea3: "",
      textarea4: "",
      formInline: {
        address: "",
        amount: 0,
        secret: ""
      }
    };
  },
  mounted() {},
  computed: {
    Account() {
      var str = this.textarea2;
      var str1 = str.split(/\r?\n/);
      var format_str = this.format(str1);
      return format_str.length;
    }
  },
  methods: {
    onSubmit() {
      this.$http
        .put(Config.setNickname, {
          secret: this.formInline.secret,
          fee: "10000000",
          type: 3,
          args: JSON.stringify([
            Config.cy,
            this.formInline.amount * 1e8 + "",
            this.formInline.address
          ])
        })
        .then(data => data.data)
        .then(data => {
          if (data.success) {
            this.$message.success("转账成功");
          } else {
            this.$message.error(data.error);
          }
        });
    },
    // getFiles() {
    //   this.loading = true;
    //   this.$http
    //     .get(Config.getFiles)
    //     .then(data => data.data)
    //     .then(data => {
    //       if (data.success) {
    //         this.filesArray = data.data;
    //       } else {
    //         console.log(data.error);
    //       }
    //     });
    // },
    handleClick() {
      this.$http
        .get(Config.getFiles2, {})
        .then(data => data.data)
        .then(data => {
          if (data.success) {
            this.$message.success(
              "向" + data.count + "人转账[" + data.amount + "]"
            );
          } else {
            this.$message.error(data.error);
          }
        });
    },
    changeText(format, array) {
      if (array.length == 0) return;
      var tmp = {};
      array.map(function(item) {
        tmp[
          item.address + "_" + item.beforeamount + "_" + item.beforecy
        ] = true;
      });
      var newFormat = format.filter(function(item) {
        return tmp[item[0] + "_" + item[1] + "_" + item[2]] ? false : true;
      });
      this.textarea2 = newFormat
        .map(function(item) {
          return item[0] + "," + item[1] + "," + item[2];
        })
        .join("\n");
    },
    ToDis(isDistinct) {
      this.PostTran(isDistinct);
      this.dialogVisible = false;
    },
    PostTran(isDistinct) {
      this.textarea2 = this.textarea2 || "";
      var str = this.textarea2;
      if (str.length == 0) {
        return this.$message.error("请输入地址和金额列表");
      }
      var str1 = str.split(/\r?\n/);
      var format_str = this.format(str1);
      var SStr = format_str.map(function(item) {
        return item[0] + "," + item[1] + "," + item[2];
      });
      if (format_str.length == 0) {
        this.$message.error("请输入正确格式的字符");
        return false;
      }
      this.tranLoading = true;
      this.$http
        .post(Config.getFiles3, { Str: SStr.join("|"), isDistinct: isDistinct })
        .then(data => data.data)
        .then(data => {
          this.tranLoading = false;
          if (data.success) {
            this.$message.success(
              "向" + data.count + "人转账[" + data.amount + "]"
            );
            var ll = data.list.map(item => {
              return item.address + "," + item.amount + "," + item.currency;
            });
            if (ll.length > 0) {
              this.textarea3 += ll.join("\n") + "\n";
            }
            this.changeText(format_str, data.list);
            if (data.errorcount > 0) {
              var message_error = data.errormessage
                .map(function(item) {
                  return "【" + item.address + "】" + item.error;
                })
                .join("\n");
              console.error(message_error);
              this.$message.error(message_error);
            }
            if (data.error_address.length > 0) {
              var ll = data.error_address
                .map(function(item) {
                  return item.name + "," + item.error;
                })
                .join("\n");
              this.textarea4 += ll + "\n";
            }
          } else {
            this.$message.error(data.error);
          }
        })
        .catch(err => {
          this.tranLoading = false;
          this.$message.error(err.message);
        });
    },

    //去重并验证
    format(array) {
      var newStr = array.filter(function(item) {
        if (item.length == 0) {
          return false;
        }
        var obj = item.split(",");
        if (obj.length <= 1) {
          return false;
        }
        var amount = obj[1];
        var address = obj[0];
        var currency = obj[2] || Config.cy;
        var address_int = parseInt(address);
        if (address_int && address_int > 0) {
          return false;
        }
        var amount_int = parseInt(amount);
        if (amount_int && amount_int > 0) {
          return true;
        }
        return false;
      });
      var newArray = newStr.map(function(item) {
        var obj = item.split(",");
        var amount = obj[1];
        var address = obj[0].trim();
        var currency = obj[2] || Config.cy;
        return [address, amount, currency];
      });
      return newArray;
    },
    ////去重并验证
    handleClick2() {
      this.textarea2 = this.textarea2 || "";
      var str = this.textarea2;
      if (str.length == 0) {
        return this.$message.error("请输入地址和金额列表");
      }
      var str1 = str.split(/\r?\n/);
      var format_str = this.format(str1);
      var SStr = format_str.map(function(item) {
        return item[0] + "," + item[1] + "," + item[2];
      });
      if (format_str.length == 0) {
        this.$message.error("请输入正确格式的字符");
        return false;
      }
      this.checkLoading = true;
      this.$http
        .get(Config.CheckDistinct, {
          params: {
            Str: SStr.join("|")
          }
        })
        .then(data => data.data)
        .then(data => {
          this.checkLoading = false;
          if (data.success) {
            if (data.server1.length == 0) {
              //this.$message.error("请输入正确格式的字符")
              //return;
            }
            this.table1 = data.client;
            this.table2 = data.server;
            this.textarea2 = data.server1
              .map(function(item) {
                return item.address + "," + item.amount + "," + item.currency;
              })
              .join("\n");
            if (data.error_address.length > 0) {
              var ll = data.error_address
                .map(function(item) {
                  return item.name + "," + item.error;
                })
                .join("\n");
              this.textarea4 += ll + "\n";
            }
          } else {
            console.error(data.error);
          }
        })
        .catch(err => {
          this.checkLoading = false;
          this.$message.error(err.message);
        });
    },
    //清空
    handleClick_clear1() {
      this.textarea2 = "";
      this.table1 = [];
      this.table2 = [];
    },
    handleClick_clear2() {
      this.textarea3 = "";
    },
    handleClick_clear3() {
      this.textarea4 = "";
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
    },
    downLoad() {
      if ("download" in document.createElement("a")) {
        var str1 = this.textarea3.split(/\r?\n/);
        var format_str = this.format(str1);
        if (format_str.length == 0) {
          this.$message.error("没有符合格式的文本");
          return;
        }
        this.downloadUti(this.textarea3);
      } else {
        this.$message.error("浏览器不支持下载文件");
      }
    },
    downLoad1() {
      if ("download" in document.createElement("a")) {
        var str1 = this.textarea4.split(/\r?\n/);
        var format_str = this.format(str1);
        this.downloadUti(this.textarea4, "error.csv");
      } else {
        this.$message.error("浏览器不支持下载文件");
      }
    },
    downLoad2() {
      if ("download" in document.createElement("a")) {
        if (this.table1.length > 0) {
          var content = this.table1
            .map(function(item) {
              return item.address + "," + item.amount + "," + item.currency;
            })
            .join("\n");
          this.downloadUti(content, "repeat_server.csv");
        }else{
			this.$message.error("无数据")
		}
      } else {
        this.$message.error("浏览器不支持下载文件");
      }
    },
    downLoad3() {
      if ("download" in document.createElement("a")) {
        if (this.table2.length > 0) {
          var content = this.table2
            .map(function(item) {
              return item.address + "," + item.amount + "," + item.currency;
            })
            .join("\n");
          this.downloadUti(content, "repeat_server.csv");
        }else{
			this.$message.error("无数据")
		}
      } else {
        this.$message.error("浏览器不支持下载文件");
      }
    }
  }
};
</script>
<style>

</style>
