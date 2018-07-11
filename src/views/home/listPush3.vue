<template>
    <div class="UiaTrans">
        <el-table></el-table>
        <el-row>
            <el-col :span="8">
                <el-button ></el-button>
                <el-input
                    type="textarea"
                    :rows="10"
                    placeholder="请输入内容"
                    v-model="textarea"></el-input>
            </el-col>
            <el-col :span="8">
                 <el-table
                    :data="tableData"
                    style="width: 100%"
                    max-height="250">
                </el-table>
            </el-col>
            <el-col :span="8">
                 <el-table
                    :data="tableData2"
                    style="width: 100%"
                    max-height="250">
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import AschJs from "asch-js"

    export default{
        data(){
            return {
                textarea:"",
                tableData:[],
                tableData2:[]
            }
        }
    }
</script>