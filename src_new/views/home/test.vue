<template>
  <div></div>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    mounted(){
        this.getData();
    },
    methods:{
        getData(){
            var that=this;
            this.$http.get("http://api.etherscan.io/api?module=account&action=txlist&address=0xab49451ca199af3Bed3043cA7A0C1BdD135a0F72").then(data=>data.data)
            .then(data=>{
                data.result.map(function(item){
                   var str= that.hexCharCodeToStr(item.input)
                    console.log(str)
                })
            })
        },
        hexCharCodeToStr(hexCharCodeStr) {
　　var trimedStr = hexCharCodeStr.trim();
　　var rawStr = 
　　trimedStr.substr(0,2).toLowerCase() === "0x"
　　? 
　　trimedStr.substr(2) 
　　: 
　　trimedStr;
　　var len = rawStr.length;
　　if(len % 2 !== 0) {
　　　　alert("Illegal Format ASCII Code!");
　　　　return "";
　　}
　　var curCharCode;
　　var resultStr = [];
　　for(var i = 0; i < len;i = i + 2) {
　　　　curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
　　　　resultStr.push(String.fromCharCode(curCharCode));
　　}
　　return resultStr.join("");
}
    }
}
</script>

<style>

</style>
