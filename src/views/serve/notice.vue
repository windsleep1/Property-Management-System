<template>
  <div class="content">
    <div class="top">
      <el-row>
        <el-col :span="5" style="margin-right: 10px">
          <el-input
            size="large"
            clearable
            placeholder="请输入发布小区"
            v-model="form.communityname"
          />
        </el-col>
        <el-col :span="5" style="margin-right: 10px">
          <el-input size="large" clearable placeholder="请输入公告主题" v-model="form.title" />
        </el-col>
        <el-col :span="6" style="margin-right: 20px">
          <el-input size="large" clearable placeholder="请输入发布内容" v-model="form.content" />
        </el-col>
        <el-col :span="7">
          <el-button v-if="userType === '1'" :icon="Plus" style="padding: 0 15px" size="large" type="success" @click="AddTable"
            >发布公告</el-button
          >
          <el-button style="padding: 0 40px" size="large" type="primary" @click="ResetTable"
            >重置</el-button
          >
        </el-col>
      </el-row>
      <div style="margin-top: 20px">
        <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="公告信息" name="notice">
            <div class="table">
              <el-table stripe border :data="tableData" style="width: 100%">
                <el-table-column
                  label="序号"
                  width="70"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                >
                  <template #default="scope">{{ scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column
                  prop="title"
                  label="公告主题"
                  width="259"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="content"
                  label="公告内容"
                  width="500"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="createtime"
                  label="发布时间"
                  width="255"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                  sortable
                >
                  <template #default="scope">
                    {{ formatDateTime(scope.row.createtime) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="communityname"
                  label="小区名称"
                  width="153"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column label="操作" width="" header-align="center" align="center">
                  <template #default="scope">
                    <el-button v-if="userType === '1'" @click="DeleteNotice(scope.row)" type="danger" size="small" :icon="DeleteFilled">归档</el-button>
                    <el-button @click="handleLook(scope.row)" type="primary" size="small" :icon="CirclePlus">查看公告</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="page">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[5, 10, 20, 50,100]"
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
          </el-tab-pane>
        </el-tabs>
        <!-- 模态框 -->
        <div class="dialog">
          <el-dialog v-model="dialogVisible" title="公告详情" width="780">
            <el-form :model="detailForm" label-width="100px" style="margin-top: 20px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="小区名称:">
                    <el-input
                      v-model="detailForm.communityname"
                      autocomplete="off"
                      :readonly="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="发布时间:">
                    <el-input
                      v-model="detailForm.createtime"
                      :prefix-icon="Calendar"
                      autocomplete="off"
                      :readonly="true"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="公告主题:">
                <el-input :readonly="true" v-model="detailForm.title" autocomplete="off" />
              </el-form-item>
              <el-form-item label="公告内容:">
                <el-input :readonly="true" type="textarea" v-model="detailForm.content" autocomplete="off" />
              </el-form-item>
              <el-form-item label="公告阅读:">
                <el-button v-if="userType === '2'" :readonly="true" type="primary" plain>阅读量+1</el-button>
                <el-button disabled v-if="userType === '1'" :readonly="true">阅读量</el-button>
              </el-form-item>
            </el-form>
            <template #footer>
              <div class="dialog-footer">
                <el-button type="primary" @click="Outdialog">关闭</el-button>
              </div>
            </template>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Calendar, CirclePlus, DeleteFilled, Plus } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { getNotice,addNotice,deleteNotice } from '@/api/serve/notice'
import type { ComponentSize } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

const userType = localStorage.getItem('type')

const dialogVisible = ref(false)
const detailForm = ref({
  communityname: '',
  createtime: '',
  title: '',
  content: '',
})

const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const size = ref<ComponentSize>('default')
const disabled = ref(false)
const background = ref(true)
const activeName = ref('notice')
const form = ref({
  communityname: '',
  title: '',
  content: '',
})

const tableData = ref([])
const query = ref({
    currPage: 0,
  pageNum: 10,
})

const handleSizeChange = (val: number) => {
  pageSize.value = val
  query.value.pageNum = val
  getNoticeList()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  query.value.currPage = val - 1
  getNoticeList()
}

// 获取
const getNoticeList = () => {
  getNotice(query.value).then((res) => {
    total.value = res.total
    tableData.value = res.data
  })
}

// 搜索
const SearchTable = () => {
    query.value.currPage = 0
    getNoticeList()
}

// 重置
const ResetTable = () => {
    form.value.communityname = ''
    form.value.title = ''
    form.value.content = ''
    query.value.currPage = 0
    currentPage.value = 1
    getNoticeList()
}

// 发布公告
const AddTable = () => {
  if (form.value.communityname === '' || form.value.title === '' || form.value.content === '') {
    ElMessageBox.alert('请确保发布的公告内容是否填写完整', '公告内容不全', {
      confirmButtonText: '确定'
    })
  }else {
    addNotice({
      ...form.value,
      token: localStorage.getItem('token')
    }).then(res => {
      ElMessage.success(res)
      ResetTable()
    }).catch(err => {
      ElMessage.error(err)
    })
  }
}

// 归档
const DeleteNotice = (row: any) => {
  ElMessageBox.confirm('确认永久归档这条公告吗？', '提示', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    type: 'warning'
  }).then(() => {
    deleteNotice({
      p_id: row.p_id,
      token: localStorage.getItem('token')
    }).then(res => {
      ElMessage.success(res)
      getNoticeList()
    }).catch(err => {
      ElMessage.error(err || '未知错误,请重试')
    })
  }).catch(() => {
    ElMessage.info('已取消归档')
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

// 查看详情
const handleLook = (row: any) => {
  dialogVisible.value = true
  detailForm.value.communityname = row.communityname
  detailForm.value.createtime = formatDateTime(row.createtime).split(' ')[0]
  detailForm.value.title = row.title
  detailForm.value.content = row.content
}

// 关闭详情
const Outdialog = () => {
  dialogVisible.value = false
}

onMounted(() => {
  getNoticeList()
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
.page {
  display: flex;
  justify-content: right;
  margin-top: 20px;
  margin-right: 25px;
}
:deep(.el-textarea__inner) {
  min-height:110px !important;
}
</style>