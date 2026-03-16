<template>
  <div class="content">
    <div class="top">
      <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="维修处理" name="weixiu">
            <div>
                <el-row style="margin-top: 20px;margin-left: 20px;margin-bottom: 20px;">
                    <el-col :span="4">
                        <div @click="smart" class="zhineng">
                            <el-icon style="font-size:60px;"><Service /></el-icon>
                            <p style="font-size: 20px;margin-top: 20px;">智能设备维修</p>
                        </div>
                    </el-col>
                    <el-col :span="4" style="margin-left:20px;">
                        <div @click="house" class="jiaju">
                            <el-icon style="font-size:60px;"><OfficeBuilding /></el-icon>
                            <p style="font-size: 20px;margin-top: 20px;">家居设备维修</p>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {  OfficeBuilding, Service } from '@element-plus/icons-vue';
import router from '@/router/index'

const activeName = ref('weixiu');

const handleClick = () => {
    console.log('click');
}

const smart = () => {
    router.push({
        name: 'smartRepair'
    });
}
const house = () => {
    router.push({
        name: 'houseRepair'
    })
}

</script>

<style scoped lang="scss">
.content {
  width: 98.6%;
  margin-left: 10px;
  background-color: #fff;
}
.top {
  margin-top: 80px;
  padding: 20px;
}
//
.zhineng {
    text-align: center;
    font-size: 16px;
    color: rgb(255, 255, 255);
    padding: 25px 0px;
    cursor: pointer;
    border-radius: 8px;
    margin: 0px 5px 15px;
    background: rgb(32, 160, 255);
    height: 112px;
}
.jiaju{
    text-align: center;
    font-size: 16px;
    color: rgb(255, 255, 255);
    padding: 25px 0px;
    cursor: pointer;
    border-radius: 8px;
    margin: 0px 5px 15px;
    background: rgb(19, 206, 102);
    height: 112px;
}
</style>