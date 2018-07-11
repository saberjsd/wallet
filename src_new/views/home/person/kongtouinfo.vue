<template>
  <el-row>
      <el-col :span="20" :offset="2" class="info">
        <br/>
        <br/>
        <strong style="margin-top:20px">ETH如何对DDC地址进行签名？</strong>
        <p class="faq_q">1、打开页面： <a href="https://www.myetherwallet.com/signmsg.html" target="blank" style="text-decoration:underline">https://www.myetherwallet.com/signmsg.html</a></p>
        <p class="faq_q_c">2、在Message栏里填写您的DDC地址：<strong>仅地址</strong></p>
        <img src="../../../assets/q&amp;a_eth_1.png">
        <p class="faq_q_c">3、选择自己合适的钱包进行签名</p>
        <img src="../../../assets/q&amp;a_eth_2.png">
        <p class="faq_q_c">4、案例：使用私钥进行签名,选择‘Private Key’， 粘贴自己的私钥，然后点击‘Unlock’</p>
        <img src="../../../assets/q&amp;a_eth_3.png">
        <p class="faq_q_c">5、点击‘sign message’</p>
        <img src="../../../assets/q&amp;a_eth_4.png">
        <p class="faq_q_c">将‘signature’里的红色框框的信息复制到DDC兑换页面中的绑定签名信息框内即可 <router-link to="/kongtou" style="color: rgb(64, 158, 255)">点击此处立即绑定</router-link> </p>
        <img src="../../../assets/q&amp;a_eth_5.png">
      </el-col>
  </el-row>
</template>

<script>
export default {

}
</script>

<style>
.info{
    width: 1000px;
}
.info img{
    width:100%
}
</style>
