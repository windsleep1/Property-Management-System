<template>
  <div class="content">
    <div class="top">
      <el-row>
        <el-col :span="5" style="padding-right: 10px">
          <el-select v-model="form.smartstatus" placeholder="智能设备状态" clearable>
            <el-option label="完好" :value="1"></el-option>
            <el-option label="待维修" :value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5" style="padding-right: 10px">
          <el-date-picker
            v-model="time"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="shortcuts"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-col>
        <el-col :span="5" style="padding-right: 10px; margin-left: 20px">
          <el-input clearable placeholder="房号" v-model="form.homenum" />
        </el-col>
        <el-col :span="8">
          <el-button style="padding: 0 30px" type="primary" @click="SearchForm" :icon="Search"
            >查询</el-button
          >
        </el-col>
      </el-row>
      <el-tabs
        v-model="activeName"
        type="border-card"
        class="demo-tabs"
        @tab-click="handleClick"
        style="margin-top: 20px"
      >
        <el-tab-pane label="智能设备" name="smart">
          <div class="table">
            <el-table stripe border :data="tableData" style="width: 100%">
              <el-table-column
                width="219"
                label="单元名称"
                prop="unitname"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                width="100"
                label="幢号"
                prop="buildnum"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                width="114"
                label="房号"
                prop="homenum"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                width="143"
                label="房主"
                prop="homename"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                width="86"
                label="空调"
                prop="airnum"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                width="186"
                label="Wi-Fi"
                prop="wifiname"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                width="86"
                label="洗衣机"
                prop="washnum"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                width="258"
                label="授予时间"
                prop="createtime"
                header-align="center"
                align="center"
                show-overflow-tooltip
              >
                <template #default="scope">
                  {{ formatDateTime(scope.row.createtime) }}
                </template>
              </el-table-column>
              <el-table-column
                width="129"
                label="状态"
                prop="smartstatus"
                header-align="center"
                align="center"
                show-overflow-tooltip
              >
                <template #default="scope">
                  {{ scope.row.smartstatus === 1 ? '完好' : '待维修' }}
                </template>
              </el-table-column>
              <el-table-column
                width=""
                label="操作状态"
                prop="smartstatus"
                header-align="center"
                align="center"
                show-overflow-tooltip
              >
                <template #default="scope">
                  <el-tooltip :content="'smartstatus: ' + scope.row.smartstatus" placement="top">
                    <el-switch
                      @click="handleSwitch(scope.row)"
                      v-model="scope.row.smartstatus"
                      :active-value="1"
                      :inactive-value="2"
                      active-color="#13ce66"
                      inactive-color="#ff4949 "
                      style="--el-switch-on-color: ; --el-switch-off-color: #ccc"
                    />
                  </el-tooltip>
                </template>
              </el-table-column>
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
              layout="total, sizes, prev, pager, next,jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="家居设备" name="house">
          <div class="table">
            <el-table stripe border :data="tableData" style="width: 100%">
              <el-table-column
                width="219"
                label="单元名称"
                prop="unitname"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                width="100"
                label="幢号"
                prop="buildnum"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                width="114"
                label="房号"
                prop="homenum"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                width="143"
                label="房主"
                prop="homename"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                width="86"
                label="空调"
                prop="airnum"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                width="186"
                label="Wi-Fi"
                prop="wifiname"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                width="86"
                label="洗衣机"
                prop="washnum"
                header-align="center"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                width="258"
                label="授予时间"
                prop="createtime"
                header-align="center"
                align="center"
                show-overflow-tooltip
              >
                <template #default="scope">
                  {{ formatDateTime(scope.row.createtime) }}
                </template>
              </el-table-column>
              <el-table-column
                width="129"
                label="状态"
                prop="familystatus"
                header-align="center"
                align="center"
                show-overflow-tooltip
              >
                <template #default="scope">
                  {{ scope.row.familystatus === 1 ? '完好' : '待维修' }}
                </template>
              </el-table-column>
              <el-table-column
                width=""
                label="操作状态"
                prop="familystatus"
                header-align="center"
                align="center"
                show-overflow-tooltip
              >
                <template #default="scope">
                  <el-tooltip :content="'familystatus: ' + scope.row.smartstatus" placement="top">
                    <el-switch
                      @click="handleSwitchHouse(scope.row)"
                      v-model="scope.row.familystatus"
                      :active-value="1"
                      :inactive-value="2"
                      active-color="#13ce66"
                      inactive-color="#ff4949 "
                      style="--el-switch-on-color: ; --el-switch-off-color: #ccc"
                    />
                  </el-tooltip>
                </template>
              </el-table-column>
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
              layout="total, sizes, prev, pager, next,jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { searchList,updateSmartStatus,updateHouseStatus } from '@/api/house/houseEquipment.ts'
import type { ComponentSize } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

const time = ref([])

const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const size = ref<ComponentSize>('default')
const disabled = ref(false)
const background = ref(true)

const activeName = ref('smart')
const handleClick = (tab: string) => {
  activeName.value = tab
  time.value = []
  form.value.smartstatus = ''
  form.value.homenum = ''
  form.value.startDate = ''
  form.value.endDate = ''
  form.value.currPage = 0
  getData()
}

const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

const form = ref({
  smartstatus: '',
  familystatus: '',
  homenum: '',
  startDate: '',
  endDate: '',
  currPage: 0,
  pageNum: 10,
  token: localStorage.getItem('token'),
})

const tableData = ref([])

const getData = () => {
  searchList(form.value).then((res) => {
    tableData.value = res.data
    total.value = res.total
  })
}

// 查询
const SearchForm = () => {
  console.log(time.value)
  form.value.startDate = time.value[0]
  form.value.endDate = time.value[1]
  form.value.currPage = 0
  getData()
}

// 切换开关
const handleSwitch = (row: any) => {
    ElMessageBox.confirm('确认更新该设备状态吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
    }).then(() => {
        updateSmartStatus({
            id: row.id,
            smartstatus: row.smartstatus,
            token: form.value.token,
        }).then(res => {
            ElMessage.success('设备状态更新成功')
        }).catch(err => {
            ElMessage.error(err)
        }) 
    }).catch(() => {
        // 还原状态
        if (row.smartstatus === 1) {
            row.smartstatus = 2
        } else {
            row.smartstatus = 1
        }
    })
}

// 切换开关  家居
const handleSwitchHouse = (row: any) => {
     ElMessageBox.confirm('确认更新该设备状态吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
    }).then(() => {
        updateHouseStatus({
            id: row.id,
            familystatus: row.familystatus,
            token: form.value.token,
        }).then(res => {
            ElMessage.success('设备状态更新成功')
        }).catch(err => {
            ElMessage.error(err)
        }) 
    }).catch(() => {
        // 还原状态
        if (row.familystatus === 1) {
            row.familystatus = 2
        } else {
            row.familystatus = 1
        }
    })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  form.value.currPage = 0
  form.value.pageNum = val
  getData()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  form.value.currPage = val - 1
  getData()
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
  getData()
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
.page {
  display: flex;
  justify-content: right;
  margin-top: 20px;
  margin-right: 25px;
}
:deep(.el-table th.el-table__cell) {
  background: rgb(238, 241, 246);
  color: rgb(31, 45, 61);
  border-color: rgb(223, 230, 236);
}
</style>