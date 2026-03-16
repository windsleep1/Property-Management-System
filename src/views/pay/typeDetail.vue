<template>
  <div class="content">
    <div class="top">
      <div class="detail">
        <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="计费项目查看" name="detail">
            <el-form label-width="130px" label-position="right" ref="ruleFormRef" :model="ruleForm">
              <el-form-item label="计费项目名称:">
                <span>{{ ruleForm.payname }}</span>
              </el-form-item>
              <el-form-item label="项目优先级:">
                <span>{{ ruleForm.paylevel }}</span>
              </el-form-item>
              <el-form-item label="项目用量/时长:">
                <span>{{ ruleForm.paynum }}</span>
              </el-form-item>
              <el-form-item label="项目价格:">
                <span>{{ ruleForm.paymoney }}</span>
              </el-form-item>
              <el-form-item label="通知状态:">
                <span>{{ ruleForm.paystatus == 1 ? '已通知' : '未通知' }}</span>
              </el-form-item>
              <el-form-item label="通知人:">
                <span>{{ ruleForm.username }}</span>
              </el-form-item>
              <el-form-item label="通知内容:">
                <div v-html="ruleForm.paycontent"></div>
                <!-- <span>{{ ruleForm.paycontent }}</span> -->
              </el-form-item>
            </el-form>
            <el-button @click="goback" type="primary" :icon="TopLeft" style="position: absolute;top: 20px;right: 20px;">返回</el-button>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { getPayDetail } from '@/api/pay/type'
import { useRoute } from 'vue-router';
import router from '@/router/index'
import {
  TopLeft
} from '@element-plus/icons-vue'

const activeName = ref('detail')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const ruleForm = ref({
    payname: '',
    paylevel: '',
    paynum: '',
    paymoney: '',
    paystatus: null,
    username: '',
    paycontent: '',
})
const route = useRoute();
const getDetail = () => {
    // 从地址栏中获取id ,传参方式是query
    const obj = {
        id: route.query.detailId,
        token: localStorage.getItem('token')
    }

    getPayDetail(obj).then(res => {
        ruleForm.value.payname = res[0].payname
        ruleForm.value.paylevel = res[0].paylevel
        ruleForm.value.paynum = res[0].paynum
        ruleForm.value.paymoney = res[0].paymoney
        ruleForm.value.paystatus = res[0].paystatus
        ruleForm.value.username = res[0].username
        ruleForm.value.paycontent = res[0].paycontent
    }).catch(err => {
        console.log(err)
    })
}

const goback = () => {
    router.push({ name: 'type' })
}

onMounted(() => {
    getDetail()
})

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
:deep(.el-form-item__content) {
    display:block !important;
}
</style>