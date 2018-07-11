<template>
  <div class="lands">
        <h4>我的地块</h4>
        <el-row>
            <el-col :span="24">
                <el-table
                    :data="list"
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="地块名"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="timestamp_format"
                        label="创建时间"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="地址"
                        >
                    </el-table-column>
                </el-table>
                <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-size="10"
      layout="total,prev, pager, next, jumper"
      :total="count">
    </el-pagination>
            </el-col>
            
        </el-row>

    <div class="map" id="map" style="height:400px">

    </div>
  </div>
</template>

<script>
import Config from "../../../config/server";
export default {

    data(){
        return {
            list:[],
            loading:false,
            count:0,
            pageIndex:1,
        }
    },
    mounted(){
        this.getLand(this.pageIndex,10)
    },
    methods:{
        handleCurrentChange(val){
            console.log(`当前页: ${val}`);
            this.pageIndex=val;
            this.getLand(this.pageIndex,10)
        },
        //初始化地图
        initMap(){
            //var map=new BMap
        },
        getLand(pageIndex,limit){
            var user=this.$store.state.user;
            if(!user){
                return false;
            }
            this.loading=true;
            this.$http.get(Config.myareas,{
                params:{
                    address:user.address,
                    offset:(pageIndex-1)*limit,
                    limit:limit
                }
            }).then(data=>data.data)
            .then(data=>{
                this.loading=false;
                if(data.success){
                    this.list=data.list;
                    this.count=data.count;
                }else{
                    this.$message.error(data.error)
                }
            }).catch(error=>{
                this.loading=false;
                this.$message.error(error.message);
            })
        }
    }
}
</script>

<style>
.lands{
    padding:10px;
}
</style>
