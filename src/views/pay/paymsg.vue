<template>
  <div class="content">
    <div class="top">
      <el-row>
        <el-col :span="6">
          <el-card shadow="always" style="height: 600px; overflow-y: scroll">
            <div style="height: 100%">
              <el-form :model="form" label-position="top">
                <el-form-item label="缴费人员">
                  <el-input clearable v-model="form.username" placeholder="输入缴费人员"></el-input>
                </el-form-item>
                <el-form-item label="缴费名称">
                  <el-input
                    clearable
                    v-model="form.payname"
                    placeholder="输入缴费项目/名称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="支付类型">
                  <el-select clearable v-model="form.costtype" placeholder="选择支付类型">
                    <el-option label="支付宝支付" :value="1"></el-option>
                    <el-option label="微信支付" :value="2"></el-option>
                    <el-option label="银联支付" :value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="支付状态">
                  <el-select clearable v-model="form.coststatus" placeholder="选择支付类型">
                    <el-option label="已支付" :value="1"></el-option>
                    <el-option label="未支付" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="支付时间">
                  <el-date-picker
                    cleaerable
                    v-model="form.paytime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
                <el-form-item label="缴费金额">
                  <el-input clearable v-model="form.paymoney" placeholder="输入缴费金额"></el-input>
                </el-form-item>
                <el-form-item v-if="showMore" label="缴费优先级">
                  <el-input
                    clearable
                    v-model="form.paylevel"
                    placeholder="输入缴费优先级"
                  ></el-input>
                </el-form-item>
                <div style="text-align: center">
                  <el-button
                    @click="showMore = !showMore"
                    v-if="!showMore"
                    text
                    :icon="CaretBottom"
                    style="color: #409eff"
                    >更多</el-button
                  >
                  <el-button
                    style="color: #409eff"
                    @click="showMore = !showMore"
                    v-if="showMore"
                    text
                    :icon="CaretTop"
                    >收起</el-button
                  >
                </div>
              </el-form>
              <div class="form-btn">
                <el-button style="padding: 0 58px" @click="ResetForm">重置</el-button>
                <el-button style="padding: 0 45px" type="primary" @click="SearchTable"
                  >立即查询</el-button
                >
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="18" style="padding-left: 20px">
          <el-card shadow="always" style="height: 600px; overflow-y: scroll">
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
              "
            >
              <h2>缴费列表</h2>
              <el-button @click="exportTable" type="primary" :icon="Download">导出</el-button>
            </div>
            <div class="table">
              <el-table
                :max-height="436"
                stripe
                border
                :data="tableData"
                style="width: 100%; height: 436px"
              >
                <el-table-column
                  prop="payname"
                  label="缴费产品"
                  width="97"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="username"
                  label="缴费人员"
                  width="120"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                >
                  <template #default="scope">{{
                    scope.row.username ? scope.row.username : '暂无'
                  }}</template>
                </el-table-column>
                <el-table-column
                  prop="costtype"
                  label="支付类型"
                  width="110"
                  header-align="center"
                  align="center"
                >
                  <template #default="scope">
                    <span v-if="scope.row.costtype === 1">支付宝支付</span>
                    <span v-if="scope.row.costtype === 2">微信支付</span>
                    <span v-if="scope.row.costtype === 3">银联支付</span>
                    <span v-if="scope.row.costtype === null">暂无</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="paymoney"
                  label="缴费金额"
                  width="130"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="paylevel"
                  label="缴费优先级"
                  width="120"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="costtime"
                  label="支付时间"
                  width="140"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                >
                  <template #default="scope">
                    {{ formatDateTime(scope.row.costtime) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="coststatus"
                  label="支付状态"
                  width=""
                  header-align="center"
                  align="center"
                >
                  <template #default="scope">
                    {{ scope.row.coststatus === 1 ? '已支付' : '未支付' }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200" header-align="center" align="center">
                  <template #default="scope">
                    <el-button v-if="userType === '2'" disabled size="small">支付</el-button>
                    <el-button size="small" style="color: #409eff" @click="goDeatil(scope.row)"
                      >查看</el-button
                    >
                    <el-button v-if="userType === '2'" disabled size="small">导出</el-button>
                    <el-button v-if="userType === '1'" size="small">导出</el-button>
                    <el-button @click="DeleteData(scope.row)" v-if="userType === '1'" size="small"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
                <!-- 空表 -->
                <template #empty>
                  <div class="table-empty-container">没有信息</div>
                </template>
              </el-table>
            </div>
            <div class="page">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[5, 10, 20, 50, 100]"
                :size="size"
                :disabled="disabled"
                :background="background"
                layout="total, sizes, prev, pager, next"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CaretBottom, CaretTop, Delete, Download } from '@element-plus/icons-vue'
import { getPayMessage, deletePay } from '@/api/pay/msg'
import type { ComponentSize } from 'element-plus'
import { ElMessageBox, ElMessage } from 'element-plus'
import router from '@/router/index'

const userType = localStorage.getItem('type')

const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)
const showMore = ref(false)
const form = ref({
  username: '',
  payname: '',
  costtype: null,
  coststatus: null,
  paytime: [],
  paymoney: '',
  paylevel: '',
  currPage: 0,
  pageNum: 10,
})

const ResetForm = () => {
  form.value.username = ''
  form.value.payname = ''
  form.value.costtype = null
  form.value.coststatus = null
  form.value.paytime = []
  form.value.paymoney = ''
  form.value.paylevel = ''
  form.value.currPage = 0
  getTableData()
}

const tableData = ref([])
const getTableData = () => {
  const obj = {
    ...form.value,
    startDate: form.value.paytime[0],
    endDate: form.value.paytime[1],
  }
  getPayMessage(obj).then((res) => {
    tableData.value = res.data
    total.value = res.total
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  form.value.pageNum = val
  getTableData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  form.value.currPage = val - 1
  getTableData()
}

// 查询
const SearchTable = () => {
  const obj = {
    ...form.value,
    currPage: 0,
    startDate: form.value.paytime[0],
    endDate: form.value.paytime[1],
  }
  getPayMessage(obj).then((res) => {
    tableData.value = res.data
    total.value = res.total
  })
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

// 导出
const exportTable = () => {
  ElMessageBox.confirm('确定导出excel文件?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // exportActivity(query)
      //   .then((res: any) => {
      //       // 创建一个二进制对象, 存储excel文件数据
      //       let blob = new Blob([res]);
      //       const link = document.createElement('a');
      //       // 创建一个下载链接,并将其赋值给href
      //       link.href = window.URL.createObjectURL(blob);
      //       link.target = '_blank';
      //       // 设置文件名
      //       let nowTime = new Date();
      //       link.setAttribute('download', `导出活动${nowTime.getTime()}.xlsx`);
      //       // 将a标签添加到页面上
      //       document.body.appendChild(link);
      //       // 触发点击事件
      //       link.click();
      //       // 移除a标签
      //       document.body.removeChild(link);
      //   })
      //   .catch((err: any) => {
      //       console.log(err, '导出失败');
      //   });
      ElMessage({
        message: '导出成功',
        type: 'success',
      })
    })
    .catch(() => {
      ElMessage({
        message: '已取消导出',
        type: 'info',
      })
    })
}

// 跳转详情
const goDeatil = (row: any) => {
  router.push({
    path: '/home/pay/payDetail',
    query: {
      detailId: row.id,
    },
  })
}

// 删除
const DeleteData = (row: any) => {
  ElMessageBox.confirm('确定删除该支付信息?', '提示', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    type: 'warning',
  }).then(() => {
    deletePay({
      id: row.id,
      token: localStorage.getItem('token'),
    })
      .then((res) => {
        ElMessage({
          message: '删除计费信息成功',
          type: 'success',
        })
        getTableData()
      })
      .catch((err) => {
        ElMessage({
          message: err,
          type: 'error',
        })
      })
  }).catch(() => {
    ElMessage({
      message: '已取消删除',
      type: 'info',
    })
  })
}

onMounted(() => {
  getTableData()
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
.form-btn {
  margin-top: 16px;
  text-align: center;
}
:deep(.el-table th.el-table__cell) {
  background: rgb(238, 241, 246);
  color: rgb(31, 45, 61);
  border-color: rgb(223, 230, 236);
}
:deep(.el-table .el-table__cell) {
  padding: 7px 0 !important;
}
.page {
  margin-top: 20px;
  display: flex;
  justify-content: right;
  padding-right: 10px;
}
.table {
  max-height: 436px;
  overflow-y: auto;
  display: block;
}
.table-empty-container {
  height: 330px; /* 根据表格高度调整 */
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
  font-size: 14px;
}
</style>