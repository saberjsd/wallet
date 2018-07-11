<template>
    <div>
        <el-form  :model="formInline" class="demo-form-inline">
  <el-form-item label="地址">
    <el-input v-model="formInline.address" placeholder="地址"></el-input>
  </el-form-item>
    <el-form-item label="密钥">
    <el-input v-model="formInline.secret" placeholder="密钥"></el-input>
    </el-form-item>
  <el-form-item label="金额">
    <el-input v-model="formInline.amount" type="number" placeholder="金额"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">转账</el-button>
  </el-form-item>
</el-form>
     <h3>批量列表</h3>
      <el-upload
    class="upload-demo"
    name="csv"
    :before-upload="beforeAvatarUpload"
    :on-success="handleAvatarSuccess"
  :action="config.Upload"
  :on-change="handleChange"
  :file-list="fileList3">
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传csv文件，且不超过500kb</div>
</el-upload>
 
     <el-table
    :data="filesArray"
    border
    style="width: 100%">
    <el-table-column
      fixed
      prop="name"
      label="文件名"
      width="150">
    </el-table-column>
    <el-table-column
      prop="count"
      label="数量"
      width="120">
    </el-table-column>
       <el-table-column
      prop="dis"
      label="重复项"
      width="120">
    </el-table-column>
  </el-table> 

  <el-button @click="handleClick()" size="small">一键添加</el-button>
  </div>
</template>
<script>
import Config from "../../config/server";
export default {
  data() {
    return {
      filesArray: [],
      timer: null,
      config:Config,
      fileList3:[],
      checkLoading:false,
      tranLoading:false,
      formInline: {
        address: "",
        amount: 0,
        secret:"",
      }
    };
  },
  mounted() {
    //this.getFiles();
    this.timer=setInterval(()=>{
        //this.getFiles();
    },5000)
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
      handleChange(file, fileList) {
        this.fileList3 = fileList.slice(-3);
      },
      beforeAvatarUpload(file){
          console.log(file.type,file);
          if(file.type=="application/vnd.ms-excel"&&file.size<1024*500){
              return true;
          }else{
              this.$message.error("请输入合适的文件")
          }
          return false;
      },
      handleAvatarSuccess(res,file){
          this.getFiles()
      },
      onSubmit() {
        this.$http.put(Config.setNickname,{
            secret: this.formInline.secret,
                fee: "10000000",
                type: 3,
                args: JSON.stringify([Config.cy, this.formInline.amount*1e8 + "",this.formInline.address])
        }).then(data=>data.data)
        .then(data=>{
            if(data.success){
                this.$message.success("转账成功")
            }else{
                 this.$message.error(data.error)
            }
        })
      },
    getFiles() {
      this.loading = true;
      this.$http
        .get(Config.getFiles)
        .then(data => data.data)
        .then(data => {
          if (data.success) {
            this.filesArray = data.data;
          } else {
            console.log(data.error);
          }
        });
    },
    handleClick() {
        this.$http.get(Config.getFiles2, {})
        .then(data=>data.data)
        .then(data => {
          if (data.success) {
            this.$message.success("向"+data.count+"人转账["+data.amount+"]");
          } else {
            this.$message.error(data.error);
          }
        });
    }
  }
};
</script>
<style>

</style>
