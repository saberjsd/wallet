<template>
  <div class="AuctionLogs">
      <h4> 操作纪录</h4>
      <el-table
        :data="list"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
            prop="timestamp_format"
            label="日期"
            width="180">
        </el-table-column>
        <el-table-column
            prop="precesion"
            label="行为"
            width="180">
        </el-table-column>
        <el-table-column
            prop="LandName"
            label="地块"
            width="180">
        </el-table-column>
        <el-table-column
            prop="amount"
            label="金额"
            width="180">
        </el-table-column>
        <el-table-column
            prop="currency"
            label="资产">
        </el-table-column>
    </el-table>
    <el-pagination
      			@current-change="handleCurrentChange"
      			:current-page="pageIndex"
      			
      			:page-size="limit"
      			layout="total, prev, pager, next, jumper"
      			:total="count">
    </el-pagination>
  </div>
</template>

<script>
import Config from "../../../config/server";
export default {
    data(){
        return {
            list:[],//表格数据,
            count:0,
            pageIndex:1,
            limit:10,
            loading:false

        }
    },
    mounted(){
        this.getDatas(this.limit,0)
    },
    methods:{
        handleCurrentChange(val){
            this.pageIndex = val;
            this.getDatas(this.limit, this.limit * (val - 1));
        },
        getDatas(limit=10,offset=0){
            var user=this.$store.state.user;
            if(!user){
                return false;
            }
            this.loading=true;
            var address=user.address;
            this.$http.get(Config.logs,{address:address,limit:limit,offset:offset})
            .then(data=>data.data)
            .then(data=>{
                this.loading=false;
                if(data.success){
                    this.list=data.list;
                    this.count=data.count;
                }else{
                    this.$message.error(data.error);
                }
            }).catch(error=>{
                 this.loading=false;
                console.error(error)
            })
        }
    }
}
</script>

<style>

</style>
