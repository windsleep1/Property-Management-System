<template>
  <div class="content">
    <div class="top">
      <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="智能设备维修" name="weixiu">
          <div>
            <el-row>
              <el-col :span="5" style="padding-right: 10px">
                <el-input
                  size="large"
                  clearable
                  placeholder="维修房主"
                  v-model="form.homename"
                ></el-input>
              </el-col>
              <el-col :span="5" style="padding-right: 10px">
                <el-select
                  size="large"
                  v-model="form.resultstatus"
                  placeholder="维修状态"
                  clearable
                >
                  <el-option label="已修复" :value="1"></el-option>
                  <el-option label="待处理" :value="2"></el-option>
                </el-select>
              </el-col>
              <el-col :span="5" style="padding-right: 10px">
                <el-date-picker
                  style="width: 300px"
                  size="large"
                  v-model="time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD"
                />
              </el-col>
              <el-col :span="9" style="padding-left: 35px">
                <el-button @click="SearchTable" size="large" type="primary" :icon="Search"
                  >查询维修</el-button
                >
                <el-button @click="ResetTable" size="large" type="primary" style="padding: 0 40px"
                  >重置</el-button
                >
                <el-button
                  v-if="useryType === '2'"
                  @click="AddTable"
                  size="large"
                  type="success"
                  :icon="Plus"
                  >申请维修</el-button
                >
              </el-col>
            </el-row>
            <div class="table">
              <el-table border :data="tableData" style="width: 100%">
                <el-table-column label="序号" width="60" header-align="center" align="center">
                  <template #default="scope">{{ scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column
                  width="117"
                  label="发布人员"
                  prop="homename"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  width="184"
                  label="房屋信息"
                  prop="housename"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  width="283"
                  label="维修内容"
                  prop="repaircontent"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  width="212"
                  label="发布时间"
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
                  width="240"
                  label="处理结果"
                  prop="resultcontent"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                >
                  <template #default="scope">
                    {{ scope.row.resultcontent || '暂无结果' }}
                  </template>
                </el-table-column>
                <el-table-column
                  width="127"
                  label="处理状态"
                  prop="resultstatus"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                >
                  <template #default="scope">
                    {{ scope.row.resultstatus === 1 ? '已修复' : '待处理' }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="" header-align="center" align="center">
                  <template #default="scope">
                    <el-button
                      v-if="useryType === '2'"
                      @click="getDeatil(scope.row)"
                      type="primary"
                      size="small"
                      :icon="View"
                      >查看</el-button
                    >
                    <el-button
                      v-if="useryType === '2'"
                      @click="DeleteTable(scope.row)"
                      size="small"
                      :icon="DeleteFilled"
                      >删除</el-button
                    >
                    <el-button
                      v-if="useryType === '1'"
                      @click="Manger(scope.row)"
                      type="primary"
                      size="small"
                      :icon="Setting"
                      >处理</el-button
                    >
                    <el-button
                      v-if="useryType === '1'"
                      @click="DeleteTable(scope.row)"
                      size="small"
                      :icon="DeleteFilled"
                      >归档</el-button
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
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 模态框 -->
    <el-dialog :title="title" v-model="dialogVisible" width="800">
      <el-form :model="DialogForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="发布人员:">
              <el-input v-model="DialogForm.homename"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="房屋信息:">
              <el-input v-model="DialogForm.housename"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="title == '智能处理'" label="房屋信息:">
          <el-input v-model="DialogForm.repaircontent"></el-input>
        </el-form-item>
        <el-form-item v-if="title == '智能处理'" label="处理结果:">
          <el-input type="textarea" v-model="DialogForm.resultcontent"></el-input>
        </el-form-item>
        <el-form-item v-if="title == '智能处理'" label="处理状态:">
          <el-switch
            :disabled="useryType === '2'"
            active-text="已修复"
            inactive-text="待处理"
            v-model="DialogForm.resultstatus"
            :active-value="1"
            :inactive-value="2"
            active-color="#13ce66"
            inactive-color="#ff4949 "
            style="--el-switch-on-color: ; --el-switch-off-color: #ccc"
          />
        </el-form-item>

        <el-form-item v-if="title == '维修申请'" label="维修类型:">
          <el-select v-model="DialogForm.repairtype" placeholder="维修类型">
            <el-option label="智能维修" :value="1"></el-option>
            <el-option label="家居维修" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="title == '维修申请'" label="维修内容:">
          <el-input type="textarea" v-model="DialogForm.repaircontent"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="title == '维修申请'" type="primary" @click="SUbmitForm">
            提交
          </el-button>
          <el-button @click="submitManger" v-if="useryType === '1'" type="primary"
            >处理提交</el-button
          >
          <el-button type="primary" @click="dialogVisible = false"> 关闭 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { DeleteFilled, Plus, Search, Setting, View } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import {
  getRepair,
  getPersonalData,
  submitApply,
  deleteApply,
  dealApply,
} from '@/api/serve/smartRepair'
import type { ComponentSize } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

const useryType = localStorage.getItem('type')

const r_id = ref(0)

const title = ref('')
const dialogVisible = ref(false)

const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const size = ref<ComponentSize>('default')
const disabled = ref(false)
const background = ref(true)

const activeName = ref('weixiu')
const time = ref([])
const form = ref({
  homename: '',
  resultstatus: null,
  repairtype: 1,
  startDate: '',
  endDate: '',
  currPage: 0,
  pageNum: 10,
  token: localStorage.getItem('token'),
})

const tableData = ref([])

const getRepairData = () => {
  getRepair(form.value).then((res) => {
    tableData.value = res.data
    total.value = res.total
  })
}

const DialogForm = ref({
  homename: '',
  housename: '',
  repairtype: 1,
  repaircontent: '',
  resultcontent: '',
  resultstatus: null,
})

const my = ref('')
const house = ref('')
const person = () => {
  getPersonalData({ id: '', token: form.value.token }).then((res) => {
    my.value = res[0].username
    house.value = res[0].homeaddress
  })
}

// 删除
const DeleteTable = (row: any) => {
  // console.log(row.resultstatus)
  if (row.resultstatus != 1) {
    ElMessage({
      message: '该条维修内容还未进行处理，不着急删除哦！',
      type: 'warning',
    })
  } else {
    ElMessageBox.confirm('确定删除该条维修信息？', '提示', {
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      type: 'warning',
    })
      .then(() => {
        deleteApply({
          r_id: row.r_id,
          token: form.value.token,
        })
          .then((res) => {
            ElMessage({
              message: '删除维修信息成功',
              type: 'success',
            })
            getRepairData()
          })
          .catch((err) => {
            ElMessage({
              message: err,
              type: 'error',
            })
          })
      })
      .catch(() => {})
  }
}

// 查看
const getDeatil = (row: any) => {
  title.value = '智能处理'
  DialogForm.value.homename = row.homename
  DialogForm.value.housename = row.housename
  DialogForm.value.repaircontent = row.repaircontent
  DialogForm.value.resultcontent = row.resultcontent
  DialogForm.value.resultstatus = row.resultstatus
  dialogVisible.value = true
}

const AddTable = () => {
  title.value = '维修申请'
  dialogVisible.value = true
  // console.log(my.value,house.value)
  DialogForm.value.homename = my.value
  DialogForm.value.housename = house.value
  DialogForm.value.repairtype = 1
  DialogForm.value.repaircontent = ''
}

const SUbmitForm = () => {
  submitApply(DialogForm.value)
    .then((res) => {
      ElMessage({
        message: '申请维修成功',
        type: 'success',
      })
      dialogVisible.value = false
      getRepairData()
    })
    .catch((err) => {
      ElMessage({
        message: '申请维修失败',
        type: 'error',
      })
    })
}

// 管理员 处理
const Manger = (row: any) => {
  title.value = '智能处理'
  DialogForm.value.homename = row.homename
  DialogForm.value.housename = row.housename
  DialogForm.value.repaircontent = row.repaircontent
  DialogForm.value.resultcontent = row.resultcontent
  DialogForm.value.resultstatus = row.resultstatus
  dialogVisible.value = true
  r_id.value = row.r_id
}
// 处理提交
const submitManger = () => {
  dealApply({
    ...DialogForm.value,
    r_id: r_id.value,
  })
    .then((res) => {
      ElMessage({
        message: '更新成功',
        type: 'success',
      })
      dialogVisible.value = false
      getRepairData()
    })
    .catch((err) => {
      ElMessage({
        message: err,
        type: 'error',
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

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  form.value.currPage = 0
  form.value.pageNum = val
  getRepairData()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  form.value.currPage = val - 1
  getRepairData()
}

// 查询

const SearchTable = () => {
  form.value.currPage = 0
  // 时间接口可能是坏的,无法查询
  form.value.startDate = time.value[0]
  form.value.endDate = time.value[1]
  getRepairData()
}
// 重置
const ResetTable = () => {
  form.value.homename = ''
  form.value.resultstatus = null
  form.value.startDate = ''
  form.value.endDate = ''
  form.value.currPage = 0
  getRepairData()
}

const handleClick = () => {
  console.log('click')
}

onMounted(() => {
  getRepairData()
  person()
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
.table {
  margin-top: 20px;
}
.page {
  display: flex;
  justify-content: right;
  margin-top: 20px;
  margin-right: 25px;
}
:deep(.el-textarea__inner) {
  min-height: 180px !important;
}
</style>