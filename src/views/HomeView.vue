<template>
  <div class="common-layout">
    <el-container>
      <el-header
        style="
          background-color: #389af9;
          position: fixed;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          width: 100%;
          height: 56px;
          overflow: hidden;
          z-index: 1000;
        "
      >
        <div>
          <span
            style="
              margin-left: 25px;
              line-height: 56px;
              color: #fff;
              cursor: pointer;
              font-weight: 600;
              text-align: center;
              font-size: 24px;
            "
            >小区物业管理系统</span
          >
        </div>
        <el-menu
          class="el-menu-popper-demo"
          mode="horizontal"
          :popper-offset="16"
          style="width: 1000px; height: 58px; line-height: 56px; margin-top: 2px"
          background-color="#389af9"
          text-color="#fff"
          active-background-color="black"
          :default-active="route.path"
          router
        >
          <el-menu-item
            style="padding: 0px 20px; margin-right: 20px; margin-left: 10px"
            index="/home/shouye"
            >首页</el-menu-item
          >
          <el-sub-menu index="2">
            <template #title>房屋管理</template>
            <el-menu-item index="/home/house/unit">房屋单元</el-menu-item>
            <!-- /home/house/houseNum -->
            <el-menu-item v-if="userType === '1'" index="/home/house/houseNum">房号管理</el-menu-item>
            <el-menu-item v-if="userType === '2'" index="/home/notFound">房号管理</el-menu-item>
            <el-menu-item v-if="userType === '2'" index="/home/notFound">房屋设备信息</el-menu-item>
            <el-menu-item v-if="userType === '1'" index="/home/house/houseEquipment">房屋设备信息</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>车位管理</template>
            <el-menu-item index="/home/parking/message">车位信息</el-menu-item>
            <el-menu-item index="/home/parking/order">车位订单</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>计费管理</template>
            <el-menu-item index="/home/pay/type">缴费类型</el-menu-item>
            <el-menu-item index="/home/pay/paymsg">缴费信息</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="5">
            <template #title>服务中心</template>
            <el-menu-item index="/home/serve/notice">公告信息</el-menu-item>
            <el-menu-item index="/home/serve/weixiu">维修处理</el-menu-item>
            <el-menu-item index="/home/serve/feedBack">反馈服务</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="6">
            <template #title>用户管理</template>
            <el-menu-item v-if="userType === '1'" index="/home/user/normal">普通用户信息</el-menu-item>
            <el-menu-item v-if="userType === '1'" index="/home/user/manger">管理员信息</el-menu-item>
            <el-menu-item v-if="userType === '2'" index="/home/notFound">普通用户信息</el-menu-item>
            <el-menu-item v-if="userType === '2'" index="/home/notFound">管理员信息</el-menu-item>
            <!-- <el-menu-item v-if="userType === '2'" index="/home/notFound">用户总表查询</el-menu-item> -->
          </el-sub-menu>
          <el-sub-menu index="7">
            <template #title>菜单管理</template>
            <el-menu-item index="/home/menu/list">菜单列表</el-menu-item>
            <el-menu-item index="/home/notFound">登录日志</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="8">
            <template #title>个人中心</template>
            <el-menu-item index="/home/owner/myMsg">我的信息</el-menu-item>
            <el-menu-item index="/home/owner/password">密码修改</el-menu-item>
          </el-sub-menu>
        </el-menu>
        <div
          style="
            display: flex;
            align-items: center;
            color: #fff;
            margin-right: 25px;
            font-size: 16px;
            line-height: 50px;
          "
        >
          <div style="margin-top: 17px; margin-right: 10px; cursor: pointer">
            <div class="img">
              <el-image
                :src="userImg"
                alt="../../public/user-default.png"
                style="width: 34px; height: 34px; border-radius: 50%"
                show-progress
                :preview-src-list="srcList"
                fit="cover"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :initial-index="4"
              />
            </div>
          </div>
          <div style="align-items: center">
            <span>{{ userName.length > 5 ? userName.substring(0, 5) + '...' : userName }},</span>
            <span style="margin-left:10px;">你好!</span>
          </div>
          <div style="margin-left: 10px">
            <el-icon
              style="
                color: white;
                font-size: 25px;
                font-weight: 600;
                position: relative;
                top: 5px;
                cursor: pointer;
              "
              @click="exit = true"
              ><SwitchButton
            /></el-icon>
          </div>
        </div>
      </el-header>
      <el-main
        style="overflow: hidden; width: 100%; background-color: #f0f0f0; padding: 0px 0px 20px 0px"
      >
        <router-view></router-view>
      </el-main>
    </el-container>
    <!-- 模态框 -->
    <el-dialog v-model="exit" width="540" class="box">
      <el-icon
        style="
          position: relative;
          left: 50%;
          transform: translate(-50%, 0);
          top: 20px;
          font-size: 100px;
          color: rgb(248, 187, 134);
          margin-bottom: 35px;
        "
        ><Warning
      /></el-icon>
      <h1 style="text-align: center; margin-bottom: 15px">提示</h1>
      <span style="display: block; text-align: center; font-size: 16px"
        >即将退出系统,是否继续?</span
      >
      <div class="box-footer">
        <el-button size="large" @click="exit = false">取消</el-button>
        <el-button size="large" type="danger" @click="logout">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getAdmin } from '@/api/shouye'
import { ElMessage } from 'element-plus'
import router from '@/router/index'

const userType = localStorage.getItem('type')

const route = useRoute()

const srcList = ref([''])
const userImg = ref('')
const userName = ref('')
const token = localStorage.getItem('token')
const exit = ref(false)

const getInfo = async () => {
  const res = await getAdmin({ token: token })
    .then((res) => {
      userImg.value = 'http://community.byesame.com/file/' + res.head
      srcList.value = ['http://community.byesame.com/file/' + res.head]
      userName.value = res.username
    })
    .catch((err) => {
      console.log(err, '11111111')
    })
}
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('type')
  localStorage.removeItem('username')
  localStorage.removeItem('id')
  exit.value = false
  ElMessage.warning('账号已退出')
  router.push({
    path: '/login',
  })
}

onMounted(() => {
  getInfo()
})
</script>

<style scoped lang="scss">
:deep(.el-sub-menu .el-sub-menu__icon-arrow) {
  display: none;
}
:deep(.el-menu--horizontal .el-menu-item:not(.is-disabled):hover) {
  background-color: #324157 !important;
  color: white !important;
}
:deep(.el-menu--horizontal > .el-sub-menu .el-sub-menu__title:hover) {
  background-color: #324157 !important;
  color: white !important;
}
:deep(.el-sub-menu__title) {
  padding: 0 20px !important;
  text-align: center !important;
  margin-right: 20px !important;
}
:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  background-color: #389af9 !important;
  color: #fff !important;
}
:deep(.el-menu--popup-container) .el-menu.el-menu--popup.el-menu--popup-bottom-start {
  display: flex !important;
  background-color: white !important;
  color: black !important;
}
:deep(.el-menu--popup-container .el-menu--popup .el-menu-item) {
  --el-menu-bg-color: white !important;
  --el-menu-text-color: black !important;
}
.box-footer {
  margin-top: 60px;
  margin-bottom: 10px;
  background-color: #f5f8fa;
  width: 500px;
  height: 66px;
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep(.el-menu--horizontal > .el-sub-menu.is-active .el-sub-menu__title) {
  color: #fff !important;
}
</style>
