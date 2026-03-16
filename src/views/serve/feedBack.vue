<template>
  <div class="content">
    <div class="top">
      <el-row>
        <el-col :span="7" style="padding-right: 10px">
          <el-input clearable size="large" v-model="form.username" placeholder="反馈人"></el-input>
        </el-col>
        <el-col :span="7" style="padding-right: 10px">
          <el-input
            clearable
            size="large"
            v-model="form.feedtext"
            placeholder="反馈内容"
          ></el-input>
        </el-col>
        <el-col :span="7" style="padding-right: 10px">
          <el-date-picker
            clearable
            size="large"
            v-model="time"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始反馈日期"
            end-placeholder="结束反馈日期"
            :shortcuts="shortcuts"
            value-format="YYYY-MM-DD"
          />
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="7" style="padding-right: 10px">
          <el-input
            clearable
            size="large"
            v-model="form.feedresult"
            placeholder="反馈回复"
          ></el-input>
        </el-col>
        <el-col :span="7" style="padding-right: 10px">
          <el-select clearable size="large" v-model="form.feedstatus" placeholder="反馈状态">
            <el-option label="已处理" :value="1"></el-option>
            <el-option label="未处理" :value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-button
            size="large"
            type="primary"
            @click="SearchTable"
            :icon="Search"
            style="padding: 0 35px"
            >搜索</el-button
          >
          <el-button
            size="large"
            type="warning"
            @click="ResetTable"
            :icon="Edit"
            style="padding: 0 35px"
            >重置</el-button
          >
          <el-button v-if="useryType === '2'" size="large" type="success" @click="AddTable" :icon="DocumentCopy"
            >留言反馈</el-button
          >
          <el-button v-if="useryType === '1'" size="large" type="danger" @click="Pidelete" :icon="DeleteFilled"
            >批量删除</el-button
          >
          <el-button v-if="useryType === '1'" size="large" type="success" @click="exportTable" :icon="Download"
            >批量导出</el-button
          >
        </el-col>
      </el-row>
      <div class="table">
        <el-table
          stripe
          border
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="50"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            width="115"
            label="反馈人"
            prop="username"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            width="265"
            label="反馈内容"
            prop="feedtext"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            width="167"
            label="反馈时间"
            prop="feedtime"
            header-align="center"
            align="center"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ formatDateTime(scope.row.feedtime) }}
            </template>
          </el-table-column>
          <el-table-column
            width="265"
            label="服务内容"
            prop="feedresult"
            header-align="center"
            align="center"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ scope.row.feedresult ? scope.row.feedresult : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column
            width="111"
            label="处理状态"
            prop="feedstatus"
            header-align="center"
            align="center"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ scope.row.feedstatus === 1 ? '已处理' : '未处理' }}
            </template>
          </el-table-column>
          <el-table-column
            width="225"
            label="服务评分"
            prop="feedscore"
            header-align="center"
            align="center"
            show-overflow-tooltip
          >
            <template #default="scope">
              <el-rate
                v-model="scope.row.feedscore"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}"
                :colors="colors"
              />
            </template>
          </el-table-column>
          <el-table-column width="" label="操作" header-align="center" align="center">
            <template #default="scope">
              <el-button v-if="useryType === '2'" @click="getDeatil(scope.row)" type="primary" size="small" :icon="View"
                >查看反馈</el-button
              >
              <el-button
                v-if="useryType === '2'"
                @click="DeleteTable(scope.row)"
                size="small"
                :icon="DeleteFilled"
                >删除反馈</el-button
              >
              <el-button v-if="useryType === '1'" @click="dealDeatil(scope.row)" size="small"
                >处理</el-button
              >
              <el-button v-if="useryType === '1'" @click="getDeatil(scope.row)" type="primary" size="small"
                >详情</el-button
              >
              <el-button v-if="useryType === '1'" @click="exportTable" size="small"
                >导出</el-button
              >
              <el-button
                v-if="useryType === '1'"
                @click="DeleteTable(scope.row)"
                size="small"
                type="danger"
                >作废</el-button
              >
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
    </div>
    <!-- 模态框 -->
    <el-dialog :title="title" v-model="dialogVisible" width="800">
      <el-form
        class="addf"
        v-if="title == '反馈添加'"
        :model="DialogForm"
        label-width="100px"
        style="margin-top: 20px"
      >
        <el-form-item label="反馈人:">
          <el-input v-model="DialogForm.username"></el-input>
        </el-form-item>
        <el-form-item label="反馈内容:">
          <el-input type="textarea" v-model="DialogForm.feedtext"></el-input>
        </el-form-item>
      </el-form>
      <el-form
        class="detailf"
        v-if="title == '反馈详情' || title == '反馈处理'"
        :model="DialogFormDetail"
        label-width="100px"
        style="margin-top: 20px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="反馈人:">
              <el-input disabled v-model="DialogFormDetail.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="反馈时间:">
              <el-input
                :prefix-icon="Calendar"
                disabled
                v-model="DialogFormDetail.feedtime"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="反馈内容:">
          <el-input type="textarea" disabled v-model="DialogFormDetail.feedtext"></el-input>
        </el-form-item>
        <el-form-item label="回复结果:">
          <el-input type="textarea" :disabled="useryType === '2'" v-model="DialogFormDetail.feedresult"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="反馈状态:">
              <el-switch
                :disabled="useryType === '2'"
                active-text="已处理"
                inactive-text="未处理"
                v-model="DialogFormDetail.feedstatus"
                :active-value="1"
                :inactive-value="2"
                active-color="#13ce66"
                inactive-color="#ff4949 "
                style="--el-switch-on-color: ; --el-switch-off-color: #ccc"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务评分:" v-if="useryType === '2'">
              <el-rate
                v-model="DialogFormDetail.feedscore"
                disabled
                text-color="#ff9900"
                show-text
                :colors="colors"
                :texts="['很差', '不满', '一般', '满意', '惊喜']"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="title == '反馈添加'" type="primary" @click="SUbmitForm">
            提交
          </el-button>
          <el-button v-if="title == '反馈详情'" type="primary" @click="dialogVisible = false"> 关闭 </el-button>
          <el-button v-if="useryType === '1' && title == '反馈处理'" type="primary" @click="dialogVisible = false"> 取消 </el-button>
          <el-button v-if="useryType === '1' && title == '反馈处理'" type="primary" @click="handlereplay"> 回复 </el-button>

        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Calendar, DeleteFilled, DocumentCopy, Download, Edit, Search, View } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { getFeedBack, addFeedBack, deleteFeedBack,batchDeleteFeedBack,replyFeedBack } from '@/api/serve/feedBack'
import type { ComponentSize } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

const useryType = localStorage.getItem('type')

const title = ref('')
const dialogVisible = ref(false)

const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const size = ref<ComponentSize>('default')
const disabled = ref(false)
const background = ref(true)

const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900']) // same as { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }

const form = ref({
  username: '',
  feedtext: '',
  startDate: '',
  endDate: '',
  feedresult: '',
  feedstatus: null,
  currPage: 0,
  pageNum: 10,
})
const time = ref([])

const tableData = ref([])
const multipleSelection = ref([])

const f_id = ref(0)
const DialogForm = ref({
  username: '',
  feedtext: '',
  token: localStorage.getItem('token'),
})
const DialogFormDetail = ref({
  username: '',
  feedtext: '',
  feedtime: '',
  feedresult: '',
  feedstatus: null,
  feedscore: 0,
})

const handleSelectionChange = (val) => {
  multipleSelection.value = val
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

const getTableData = () => {
  const obj = {
    ...form.value,
    startDate: time.value[0],
    endDate: time.value[1],
  }
  getFeedBack(obj).then((res) => {
    tableData.value = res.data
    res.data.forEach((item) => {
      if (item.feedscore == null) {
        item.feedscore = 0
      }
    })
    total.value = res.total
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  form.value.currPage = 0
  form.value.pageNum = val
  getTableData()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  form.value.currPage = val - 1
  getTableData()
}

// 搜索
const SearchTable = () => {
  form.value.currPage = 0
  getTableData()
}

// 重置
const ResetTable = () => {
  form.value.username = ''
  form.value.feedtext = ''
  form.value.startDate = ''
  form.value.endDate = ''
  form.value.feedresult = ''
  form.value.feedstatus = null
  form.value.currPage = 0
  time.value = []
  getTableData()
}

// 新增留言反馈
const AddTable = () => {
  title.value = '反馈添加'
  dialogVisible.value = true
  DialogForm.value.username = localStorage.getItem('username')
  DialogForm.value.feedtext = ''
}

// 提交
const SUbmitForm = () => {
  addFeedBack(DialogForm.value)
    .then((res) => {
      ElMessage.success('反馈添加成功')
      dialogVisible.value = false
      getTableData()
    })
    .catch((err) => {
      ElMessage.error('反馈添加失败,请重试')
    })
}

// 查看详情
const getDeatil = (row) => {
  title.value = '反馈详情'
  DialogFormDetail.value.username = row.username
  DialogFormDetail.value.feedtext = row.feedtext
  DialogFormDetail.value.feedtime = formatDateTime(row.feedtime)
  DialogFormDetail.value.feedresult = row.feedresult
  DialogFormDetail.value.feedstatus = row.feedstatus
  DialogFormDetail.value.feedscore = row.feedscore
  dialogVisible.value = true
}

// 删除反馈
const DeleteTable = (row) => {
  ElMessageBox.confirm('确定删除该反馈内容?', '提示', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    type: 'warning',
  })
    .then(() => {
      deleteFeedBack({
        f_id: row.f_id,
        token: localStorage.getItem('token'),
      }).then((res) => {
        ElMessage({
          type: 'success',
          message: '删除反馈内容成功',
        })
        getTableData()
      }).catch(err => {
        ElMessage({
          type: 'error',
          message: '删除反馈内容失败,请重试',
        })
        getTableData()
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}

// 批量删除
const Pidelete = () => {
  if (multipleSelection.value.length === 0) {
    ElMessageBox.alert('请选择要删除的反馈内容', '提示', {
      confirmButtonText: '确定',
    })
  }else {
    ElMessageBox.confirm('确定删除选中的反馈内容?', '提示', {
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      type: 'warning',
    }).then(() => {
      // 遍历选中的id,将每个id分别当作一个参数传入批量删除接口
      const ids = multipleSelection.value.map((item) => item.f_id)
      batchDeleteFeedBack({
        ids: ids,
        token: localStorage.getItem('token'),
      }).then((res) => {
        ElMessage({
          type: 'success',
          message: '删除反馈内容成功',
        })
        getTableData()
        multipleSelection.value = []
      }).catch(err => {
        ElMessage({
          type: 'error',
          message: err,
        })
        getTableData()
        multipleSelection.value = []
      })
    }).catch(() => {})
  }
}

// 批量导出
const exportTable = () => {
  ElMessageBox.confirm('确定导出excel文件?', '提示', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    type: 'warning',
  }).then(() => {
    ElMessage.success('导出成功')
  })
    .catch(() => {})
}

// 处理
const dealDeatil = (row) => {
  title.value = '反馈处理'
  DialogFormDetail.value.username = row.username
  DialogFormDetail.value.feedtext = row.feedtext
  DialogFormDetail.value.feedtime = formatDateTime(row.feedtime)
  DialogFormDetail.value.feedresult = row.feedresult
  DialogFormDetail.value.feedstatus = row.feedstatus
  DialogFormDetail.value.feedscore = row.feedscore
  f_id.value = row.f_id
  dialogVisible.value = true
}

// 回复
const handlereplay = () => {
  replyFeedBack({
    f_id: f_id.value,
    feedresult: DialogFormDetail.value.feedresult,
    feedstatus: DialogFormDetail.value.feedstatus,
    token: localStorage.getItem('token'),
  }).then(res => {
    ElMessage.success('反馈服务回复成功')
    dialogVisible.value = false
    getTableData()
  }).catch(err => {
    ElMessage({
      message: err,
      type: 'error',
    })
    dialogVisible.value = false
    getTableData()
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
  padding: 20px 20px 40px 20px;
}
:deep(.el-table th.el-table__cell) {
  background: rgb(238, 241, 246);
  color: rgb(31, 45, 61);
  border-color: rgb(223, 230, 236);
}
.table {
  margin-top: 20px;
}
.page {
  display: flex;
  justify-content: right;
  margin-top: 20px;
  margin-right: 25px;
}
:deep(.el-table .el-table__cell) {
  padding: 5px 0 !important;
}

.addf :deep(.el-textarea__inner) {
  min-height: 180px !important;
}
.detailf :deep(.el-textarea__inner) {
  min-height: 120px !important;
}
</style>