<template>
  <div class="content">
    <div class="top">
      <div class="detail">
        <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="缴费信息详情" name="detail">
            <el-form label-width="100" ref="ruleFormRef" :model="ruleForm" style="width: 100%">
              <el-row style="padding-left: 50px; margin-top: 20px">
                <el-col :span="9" style="margin-right: 80px">
                  <el-form-item label="缴费产品:">
                    <el-input disabled v-model="ruleForm.payname"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="缴费人员:">
                    <el-input disabled v-model="ruleForm.username"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="padding-left: 50px">
                <el-col :span="9" style="margin-right: 80px">
                  <el-form-item label="缴费金额:">
                    <el-input disabled v-model="ruleForm.paymoney"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="缴费优先级:">
                    <el-input disabled v-model="ruleForm.paylevel"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="padding-left: 50px">
                <el-col :span="9" style="margin-right: 80px">
                  <el-form-item label="支付时间:">
                    <el-input disabled v-model="ruleForm.costtime"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="支付状态:">
                    <el-input disabled v-model="ruleForm.coststatus"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="padding-left: 50px; margin-top: 50px">
                <el-form-item label="支付类型">
                  <el-radio-group v-model="ruleForm.costtype">
                    <el-radio :value="1">
                      <img src="/zfb.png" alt="" style="width: 100px; height: 100px" />
                    </el-radio>
                    <el-radio :value="2">
                      <img src="/wx.png" alt="" style="width: 100px; height: 100px" />
                    </el-radio>
                    <el-radio :value="3">
                      <img src="/ysf.png" alt="" style="width: 100px; height: 100px" />
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-row>
              <el-row style="padding-left: 50px; margin-top: 50px">
                <el-form-item label="回复内容:">
                  <div v-html="ruleForm.costcontent"></div>
                </el-form-item>
              </el-row>
            </el-form>
            <el-button
              @click="goback"
              type="primary"
              :icon="TopLeft"
              style="position: absolute; top: 20px; right: 20px"
              >返回</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { getPayDeatil } from '@/api/pay/msg'
import { useRoute } from 'vue-router'
import router from '@/router/index'
import { TopLeft } from '@element-plus/icons-vue'

const activeName = ref('detail')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const ruleForm = ref({
  payname: '',
  username: '',
  paymoney: '',
  paylevel: '',
  costtime: '',
  coststatus: '',
  costtype: null,
  costcontent: '',
})

const route = useRoute()
const getDetail = () => {
  // 从地址栏中获取id ,传参方式是query
  const obj = {
    id: route.query.detailId,
    token: localStorage.getItem('token'),
  }

  getPayDeatil(obj)
    .then((res) => {
      ruleForm.value.payname = res[0].payname
      ruleForm.value.username = res[0].username
      ruleForm.value.paymoney = res[0].paymoney
      ruleForm.value.paylevel = res[0].paylevel
      ruleForm.value.costtime = formatDateTime(res[0].costtime)
      ruleForm.value.costtype = res[0].costtype
      if(res[0].coststatus === 1) {
        ruleForm.value.coststatus = '已支付'
      }else if(res[0].coststatus === 2) {
        ruleForm.value.coststatus = '未支付'
      }
      ruleForm.value.costcontent = res[0].costcontent
    })
    .catch((err) => {
      console.log(err)
    })
}

const goback = () => {
  router.push({ name: 'paymsg' })
}

// 处理时间(加八小时)
const formatDateTime = (dateTime: string) => {
  if (!dateTime) return '暂无'

  // 创建UTC日期对象
  const date = new Date(dateTime)

  // 直接获取UTC时间的各个部分，手动加8小时
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  // 手动加8小时（处理跨天情况）
  let hours = date.getUTCHours() + 8
  let displayDay = day

  // 处理加8小时后跨天的情况
  if (hours >= 24) {
    hours -= 24
    // 计算下一天的日期（简化处理，不考虑月份和年份变化）
    displayDay = String(parseInt(day) + 1).padStart(2, '0')
  }

  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')

  return `${year}-${month}-${displayDay} ${String(hours).padStart(2, '0')}:${minutes}:${seconds}`
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
:deep(.el-tabs__content) {
  height: 530px !important;
}
</style>