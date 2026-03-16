<template>
  <div class="content">
    <div class="top">
      <el-form :model="form" label-width="auto">
        <el-row>
          <el-col :span="4">
            <el-form-item label="">
              <el-input
                clearable
                placeholder="小区名称"
                v-model="form.communityname"
                size="large"
                style="margin-right: 10px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="">
              <el-input
                clearable
                placeholder="单元名称"
                v-model="form.unitname"
                size="large"
                style="margin-right: 10px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="">
              <el-date-picker
                v-model="form.createDt"
                type="date"
                placeholder="建设时间"
                :disabled-date="disabledDate"
                :shortcuts="shortcuts"
                :size="pickersize"
                style="margin-right: 10px; width: 265px"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="">
              <el-select
                size="large"
                style="width: 265px"
                v-model="form.value"
                placeholder="选择状态"
                clearable
              >
                <el-option label="已建成" :value="1"></el-option>
                <el-option label="未建成" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="btns" style="margin-left: 60px">
              <el-button @click="SearchForm" style="height: 40px" type="primary" :icon="Search" />
              <el-button
                v-if="userType === '1'"
                @click="addForm"
                style="padding: 0 35px; height: 40px"
                type="success"
                :icon="Plus"
                >录入</el-button
              >
              <el-button
                @click="ResetForm"
                style="padding: 0 35px; height: 40px"
                type="primary"
                :icon="RefreshRight"
                >重置</el-button
              >
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="bottom">
      <el-table
        :header-cell-style="{ backgroundColor: 'rgb(223, 230, 236);', color: 'black' }"
        border
        :data="tableData"
        style="width: 98.6%"
      >
        <el-table-column
          width="298"
          label="小区名称"
          prop="communityname"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          width="294"
          label="单元名称"
          prop="unitname"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          width="176"
          label="栋数"
          prop="unitnum"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          width="294"
          label="建设时间"
          prop="createtime"
          header-align="center"
          align="center"
        >
          <template #default="scope">{{ formatDateTime(scope.row.createtime) }}</template>
        </el-table-column>
        <el-table-column
          width="191"
          label="状态"
          prop="unitstatus"
          header-align="center"
          align="center"
        >
          <template #default="scope">{{
            scope.row.unitstatus === 2 ? '未建成' : '已建成'
          }}</template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template #default="scope">
            <el-button
              v-if="userType === '2'"
              @click="getDetail(scope.row)"
              size="small"
              style="color: rgb(98, 168, 234)"
              >房屋单元详情</el-button
            >
            <el-button
              v-if="userType === '1'"
              @click="getDetail(scope.row)"
              size="small"
              style="color: rgb(98, 168, 234)"
              >详情</el-button
            >
            <el-button
              v-if="userType === '1'"
              @click="DeleteTable(scope.row)"
              size="small"
              type="danger"
              plain
              >归档</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :size="size"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, RefreshRight, Calendar, Plus } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import type { ComponentSize } from 'element-plus'
import { getHouse, getSearch, deleteUnit } from '@/api/house/danyuan'
import router from '@/router/index'
import { ElMessage, ElMessageBox } from 'element-plus'

const userType = localStorage.getItem('type')

const form = ref({
  communityname: '',
  unitname: '',
  createDt: '',
  value: null,
})
const options = ref([])
const query = ref({
  currPage: 0,
  pageNum: 10,
})
const tableData = ref([])

const pickersize = ref<'default' | 'large' | 'small'>('large')
const shortcuts = [
  {
    text: '今天',
    value: new Date(),
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: '一周前',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
]
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const size = ref<ComponentSize>('default')
const disabled = ref(false)
const background = ref(true)

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

const handleSizeChange = (val: number) => {
  pageSize.value = val
  query.value.pageNum = val
  getTableData()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  query.value.currPage = val - 1
  getTableData()
}

const getTableData = () => {
  getHouse(query.value).then((ref: any) => {
    tableData.value = ref.data
    total.value = ref.total
  })
}
// 搜素
const SearchForm = () => {
  const obj = {
    ...form.value,
    currPage: 1,
    pageNum: 10,
    token: localStorage.getItem('token'),
  }
  getSearch(obj).then((ref: any) => {
    tableData.value = ref.data
    total.value = ref.total
  })
}

// 重置
const ResetForm = () => {
  form.value = {
    communityname: '',
    unitname: '',
    createDt: '',
    value: null,
  }
  SearchForm()
}

// 跳转详情
const getDetail = (row: any) => {
  router.push({
    path: '/home/house/unitDetail',
    query: {
      type: 'DETAIL',
      detailId: row.id,
    },
  })
}

// 归档
const DeleteTable = (row: any) => {
  ElMessageBox.confirm('确认删除该单元信息？', '提示', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    type: 'warning',
  })
    .then(() => {
      deleteUnit({
        id: row.id,
        token: localStorage.getItem('token'),
      })
        .then(() => {
          ElMessage.success('信息删除成功')
          getTableData()
        })
        .catch((err) => {
          ElMessage.error(err)
        })
    })
    .catch(() => {})
}

// 录入
const addForm = () => {
  router.push({
    name: 'unitAdd',
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
.bottom {
  margin-left: 20px;
  padding-bottom: 30px;
}
:deep(.el-table th.el-table__cell) {
  background: rgb(238, 241, 246);
  color: rgb(31, 45, 61);
  border-color: rgb(223, 230, 236);
}
.page {
  display: flex;
  justify-content: right;
  margin-top: 20px;
  margin-right: 25px;
}
</style>