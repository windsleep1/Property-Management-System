<template>
  <div class="notFound">
    <img src="/404.gif" alt="404">
    <div class="cont">
      <h1>Oh! no~</h1>
      <h1>很抱歉, 你的页面走丢了!</h1>
      <p>请检查你输入的网址是否正确，或点击返回按钮！</p>
      <el-button @click="$router.go(-1)" type="danger" style="margin-top: 20px;">返回上一页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();


</script>

<style scoped lang="scss">
.notFound {
  width:100%;
  margin:auto;
}
.notFound img {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index:5000;
}
.cont {
    position: absolute;
    top:210px;
    right:230px;
    z-index: 6000;
}
</style>