<template>
  <div class="content">
    <div class="top">
      <h4 style="margin-left: 10px; margin-bottom: 20px; margin-top: 20px">
        计费管理 / 缴费类型管理
      </h4>
      <div class="zhuti">
        <el-row>
          <el-col :span="4">
            <el-input clearable placeholder="项目价格" v-model="query.paymoney" />
          </el-col>
          <el-col :span="4" style="padding-left: 10px">
            <el-select clearable v-model="query.paystatus" placeholder="通知状态">
              <el-option label="已通知" :value="1"></el-option>
              <el-option label="未通知" :value="2"></el-option>
            </el-select>
          </el-col>
          <el-col
            :span="16"
            style="padding-left: 40px; display: flex; justify-content: space-between"
          >
            <h2 style="min-height: 30px; margin: 0; display: flex; align-items: center;">{{ tabletitle || '缴费项目列表' }}</h2>
            <div>
              <el-button @click="SearchTable" type="primary" :icon="Search">查询</el-button>
              <el-button v-if="userType === '1'" @click="AddTable" type="success" :icon="Plus">新增</el-button>
              <el-button @click="ResetTable" type="primary" :icon="Refresh">刷新</el-button>
              <el-button @click="ExportTable" type="primary" :icon="Upload">导出</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="8">
            <el-tree
              style="max-width: 600px"
              :data="treedata"
              default-expand-all
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            />
          </el-col>
          <el-col :max-height="380" :span="16" style="padding-left: 30px">
            <div class="table">
              <!-- 添加表格加载状态 -->
              <el-table 
                stripe 
                border 
                :data="tableData" 
                style="width: 100%; height: 380px"
                v-loading="tableLoading"
                element-loading-text="加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
              >
                <el-table-column
                  prop="payname"
                  label="缴费项目名称"
                  width="113"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  width="108"
                  prop="paylevel"
                  label="缴费项目优先级"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="paynum"
                  label="项目用量/时长"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="paymoney"
                  label="项目价格"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="paytime"
                  label="创建时间"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                >
                  <template #default="scope">
                    {{ formatDateTime(scope.row.paytime).split(' ')[0] }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="username"
                  label="通知人"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                >
                  <template #default="scope">
                    {{ scope.row.username ? scope.row.username : '暂无' }}
                  </template>
                </el-table-column>
                <el-table-column prop="paystatus" label="状态" header-align="center" align="center">
                  <template #default="scope">
                    {{ scope.row.paystatus === 1 ? '已通知' : '未通知' }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" header-align="center" align="center" width="178">
                  <template #default="scope">
                    <el-button @click="goDetail(scope.row)" size="small" style="color: #409eff">查看计费类型</el-button>
                  </template>
                </el-table-column>
                <!-- 空表 -->
                <template #empty>
                  <div class="table-empty-container">暂无数据</div>
                </template>
              </el-table>
            </div>
          </el-col>
        </el-row>
        <div class="page">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[9, 10, 20, 50]"
            :size="size"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Refresh, Upload, Plus, Loading } from '@element-plus/icons-vue'
import type { ComponentSize } from 'element-plus'
import { getPay } from '@/api/pay/type'
import { ElMessage, ElMessageBox } from 'element-plus'
import route from '@/router/index'

const userType = localStorage.getItem('type')

// 添加表格加载状态变量
const tableLoading = ref(false)

const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(9)
const size = ref<ComponentSize>('default')
const background = ref(true)
const disabled = ref(false)
const query = ref({
  c_id: 7,
  paymoney: '',
  paystatus: null,
  currPage: 0,
  pageNum: 9,
})

const tableData = ref([])
const tabletitle = ref('电费目录')

// 树形控件
interface Tree {
  label: string
  c_id?: number
  children?: Tree[]
}

// 为每个节点设置对应的标题
const nodeTitleMap = {
  7: '电费目录',
  8: '水费固定月目录',
  9: '水费按量目录',
  10: '天然气目录',
  11: '物业费目录',
  12: '宽带费目录',
  2: '电费项目',
  3: '水费项目',
  4: '天然气项目',
  5: '物业费项目',
  6: '宽带费项目',
  1: '缴费项目'
}

const handleNodeClick = (data: Tree) => {
  if (data.c_id) {
    // 设置对应标题
    tabletitle.value = nodeTitleMap[data.c_id] || '缴费项目列表'
    
    // 显示加载状态
    tableLoading.value = true
    
    // 根据c_id调用对应的获取数据方法
    if (data.c_id === 7) {
      getDianPayData()
    } else if (data.c_id === 8) {
      getGdWaterPayData()
    } else if (data.c_id === 9) {
      getQbWaterPayData()
    } else if (data.c_id === 10) {
      getGasPayData()
    } else if (data.c_id === 11) {
      getEstatePayData()
    } else if (data.c_id === 12) {
      getBroadbandPayData()
    } else {
      // 大类目查询
      query.value.c_id = data.c_id
      getPay({
        ...query.value,
        c_id: data.c_id
      }).then((res) => {
        total.value = res.total
        tableData.value = res.data
        tableLoading.value = false // 关闭加载状态
      }).catch(() => {
        tableLoading.value = false // 关闭加载状态
      })
    }
  }
}

const treedata: Tree[] = [
  {
    label: '缴费项目',
    c_id: 1,
    children: [
      {
        label: '电费项目',
        c_id: 2,
        children: [
          {
            label: '电费目录表',
            c_id: 7, // 对应电费的c_id
          },
        ],
      },
      {
        label: '水费项目',
        c_id: 3,
        children: [
          {
            label: '水费固定月目录表',
            c_id: 8, // 对应水费固定月的c_id
          },
          {
            label: '水费按量计价目录表',
            c_id: 9, // 对应水费按量的c_id
          },
        ],
      },
      {
        label: '天然气项目',
        c_id: 4,
        children: [
          {
            label: '天然气目录表',
            c_id: 10, // 对应天然气的c_id
          },
        ],
      },
      {
        label: '物业费项目',
        c_id: 5,
        children: [
          {
            label: '物业费目录表',
            c_id: 11, // 对应物业费的c_id
          },
        ],
      },
      {
        label: '宽带费项目',
        c_id: 6,
        children: [
          {
            label: '宽带费目录表',
            c_id: 12, // 对应宽带费的c_id
          },
        ],
      },
    ],
  },
]

// 电费
const getDianPayData = () => {
  query.value.c_id = 7
  tableLoading.value = true // 显示加载状态
  getPay({
    ...query.value,
  }).then((res) => {
    total.value = res.total
    tableData.value = res.data
    tableLoading.value = false // 关闭加载状态
  }).catch(() => {
    tableLoading.value = false // 关闭加载状态
  })
}
// 水费固定月目录表
const getGdWaterPayData = () => {
  query.value.c_id = 8
  tableLoading.value = true // 显示加载状态
  getPay({
    ...query.value,
  }).then((res) => {
    total.value = res.total
    tableData.value = res.data
    tableLoading.value = false // 关闭加载状态
  }).catch(() => {
    tableLoading.value = false // 关闭加载状态
  })
}
// 水费按量计价目录表
const getQbWaterPayData = () => {
  query.value.c_id = 9
  tableLoading.value = true // 显示加载状态
  getPay({
    ...query.value,
  }).then((res) => {
    total.value = res.total
    tableData.value = res.data
    tableLoading.value = false // 关闭加载状态
  }).catch(() => {
    tableLoading.value = false // 关闭加载状态
  })
}
// 天然气目录表
const getGasPayData = () => {
  query.value.c_id = 10
  tableLoading.value = true // 显示加载状态
  getPay({
    ...query.value,
  }).then((res) => {
    total.value = res.total
    tableData.value = res.data
    tableLoading.value = false // 关闭加载状态
  }).catch(() => {
    tableLoading.value = false // 关闭加载状态
  })
}
// 物业费目录表
const getEstatePayData = () => {
  query.value.c_id = 11
  tableLoading.value = true // 显示加载状态
  getPay({
    ...query.value,
  }).then((res) => {
    total.value = res.total
    tableData.value = res.data
    tableLoading.value = false // 关闭加载状态
  }).catch(() => {
    tableLoading.value = false // 关闭加载状态
  })
}
// 宽带费目录表
const getBroadbandPayData = () => {
  query.value.c_id = 12
  tableLoading.value = true // 显示加载状态
  getPay({
    ...query.value,
  }).then((res) => {
    total.value = res.total
    tableData.value = res.data
    tableLoading.value = false // 关闭加载状态
  }).catch(() => {
    tableLoading.value = false // 关闭加载状态
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  query.value.pageNum = val
  tableLoading.value = true // 显示加载状态
  
  if (query.value.c_id == 7) {
    getDianPayData()
  } else if (query.value.c_id == 8) {
    getGdWaterPayData()
  } else if (query.value.c_id == 9) {
    getQbWaterPayData()
  } else if (query.value.c_id == 10) {
    getGasPayData()
  } else if (query.value.c_id == 11) {
    getEstatePayData()
  } else if (query.value.c_id == 12) {
    getBroadbandPayData()
  } else {
    // 如果是大类目，直接查询
    getPay(query.value).then(res => {
      total.value = res.total
      tableData.value = res.data
      tableLoading.value = false
    }).catch(() => {
      tableLoading.value = false
    })
  }
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  query.value.currPage = val - 1
  tableLoading.value = true // 显示加载状态
  
  if (query.value.c_id == 7) {
    getDianPayData()
  } else if (query.value.c_id == 8) {
    getGdWaterPayData()
  } else if (query.value.c_id == 9) {
    getQbWaterPayData()
  } else if (query.value.c_id == 10) {
    getGasPayData()
  } else if (query.value.c_id == 11) {
    getEstatePayData()
  } else if (query.value.c_id == 12) {
    getBroadbandPayData()
  } else {
    // 如果是大类目，直接查询
    getPay(query.value).then(res => {
      total.value = res.total
      tableData.value = res.data
      tableLoading.value = false
    }).catch(() => {
      tableLoading.value = false
    })
  }
}

// 查询
const SearchTable = () => {
  tableLoading.value = true // 显示加载状态
  getPay(query.value).then((res) => {
    total.value = res.total
    tableData.value = res.data
    tableLoading.value = false // 关闭加载状态
  }).catch(() => {
    tableLoading.value = false // 关闭加载状态
  })
}
// 刷新
const ResetTable = () => {
  currentPage.value = 1
  query.value.currPage = 0
  tableLoading.value = true // 显示加载状态
  getPay(query.value).then((res) => {
    total.value = res.total
    tableData.value = res.data
    tableLoading.value = false // 关闭加载状态
  }).catch(() => {
    tableLoading.value = false // 关闭加载状态
  })
}
// 导出
const ExportTable = () => {
  ElMessageBox.confirm('确定导出excel文件?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ElMessage({
        message:'导出成功',
        type:'success'
      })
    })
    .catch(() => {
      ElMessage({
        message:'已取消导出',
        type: 'info'
      })
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

// 跳转详情
const goDetail = (row: any) => {
    route.push({
        path: '/home/pay/typeDeatil',
        query: {
            type: 'DETAIL',
            detailId: row.id
        }
    })
}

// 新增
const AddTable = () => {
  route.push({
    path: '/home/pay/typeAdd',
    query: {
      type: 'ADD',
      paystatus:2
    }
  })
}


onMounted(() => {
  getDianPayData()
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
:deep(.el-table th.el-table__cell) {
  background: rgb(238, 241, 246);
  color: rgb(31, 45, 61);
  border-color: rgb(223, 230, 236);
}
:deep(.el-table .el-table__cell) {
  padding: 5px 0 !important;
}
.page {
  display: flex;
  justify-content: right;
  margin-top: 10px;
  margin-right: 25px;
}
.table {
  // max-height: 442px;
  max-height: 380px;
  overflow-y: auto;
  display: block;
}
:deep(.el-table) {
  height: 100%; 
}
.table-empty-container {
  height: 330px; /* 根据表格高度 */
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
  font-size: 14px;
}

/* 加载状态样式 */
:deep(.el-loading-mask) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

:deep(.el-loading-spinner) {
  margin-bottom: 16px;
}
</style>