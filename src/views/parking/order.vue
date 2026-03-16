<template>
  <div class="content">
    <div class="top">
      <div class="form">
        <el-form :model="form" label-width="auto">
          <el-row>
            <el-col :span="5">
              <el-form-item label="">
                <el-input
                  clearable
                  placeholder="车位名称"
                  v-model="form.parkname"
                  size="large"
                  style="margin-right: 10px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="">
                <el-input
                  clearable
                  placeholder="应缴金额"
                  v-model="form.orderpay"
                  size="large"
                  style="margin-right: 10px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="">
                <el-select
                  size="large"
                  style="width: 265px"
                  v-model="form.orderstatus"
                  placeholder="缴费状态"
                  clearable
                >
                  <el-option label="已缴费" :value="1"></el-option>
                  <el-option label="未缴费" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <div class="btns" style="">
                <el-button
                  @click="SearchForm"
                  style="padding: 0 40px; height: 40px"
                  type="primary"
                  :icon="Search"
                  >查询</el-button
                >
                <el-button
                  @click="ExportForm"
                  style="padding: 0 25px; height: 40px"
                  type="success"
                  :icon="DocumentCopy"
                  >全量导出</el-button
                >
                <el-button
                  @click="ResetForm"
                  style="padding: 0 40px; height: 40px"
                  type="primary"
                  :icon="RefreshRight"
                  >重置</el-button
                >
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="table">
        <el-table
          :header-cell-style="{ backgroundColor: 'rgb(223, 230, 236);', color: 'black' }"
          border
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column width="70" label="序号" header-align="center" align="center">
            <template #default="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="220"
            label="车位名称"
            prop="parkname"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            width="200"
            label="车位金额"
            prop="parkpay"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            width="240"
            label="开始时间"
            prop="startdate"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <span>{{ formatDateTime(scope.row.startdate) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="240"
            label="结束时间"
            prop="enddate"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <span>{{ formatDateTime(scope.row.enddate) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="140"
            label="应缴金额"
            prop="orderpay"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.orderpay">{{ scope.row.orderpay }}</span>
              <span v-else>暂无</span>
            </template>
          </el-table-column>
          <el-table-column
            width=""
            label="缴费状态"
            prop="orderstatus"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <el-tooltip :content="'order sattus: ' + scope.row.orderstatus" placement="top">
                <el-switch
                  inline-prompt
                  active-text="已缴费"
                  inactive-text="未缴费"
                  v-model="scope.row.orderstatus"
                  :active-value="1"
                  :inactive-value="2"
                  active-color="#13ce66"
                  inactive-color="#ff4949 "
                  style="--el-switch-on-color: ; --el-switch-off-color: #ccc"
                  @click="changePaytype(scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column width="200" label="操作" header-align="center" align="center">
            <template #default="scope">
              <el-button
                v-if="userType === '1'"
                @click="noticePay(scope.row)"
                size="mini"
                style="font-size: 12px"
                >通知缴费</el-button
              >
              <el-button
                v-if="userType === '2'"
                @click="getPay(scope.row)"
                size="mini"
                style="font-size: 12px"
                >车位缴费</el-button
              >
              <el-button
                @click="getDetail(scope.row)"
                size="mini"
                style="font-size: 12px; color: rgb(98, 168, 234)"
                >缴费详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 40, 50]"
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
    <!-- 模态框 -->
    <div class="dialog">
      <el-dialog v-model="dialogVisible" :title="title" width="800">
        <el-form
          v-if="title === '车位缴费' || title === '车位订单通知'"
          :model="detailForm"
          label-width="100px"
        >
          <el-form-item label="开始时间:">
            <el-date-picker
              :disabled="userType === '2'"
              v-model="detailForm.startdate"
              type="date"
              placeholder="请选择"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="结束时间:">
            <el-date-picker
              :disabled="userType === '2'"
              v-model="detailForm.enddate"
              type="date"
              placeholder="请选择"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="应缴金额:">
            <el-input
              :disabled="userType === '2'"
              v-model="detailForm.orderpay"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="通知内容:" v-if="userType === '2'">
            <el-input type="textarea" disabled v-model="detailForm.note" autocomplete="off" />
          </el-form-item>
          <el-form-item label="缴费状态:">
            <el-select :disabled="payIs" v-model="detailForm.orderstatus" placeholder="请选择">
              <el-option label="已缴费" :value="1"></el-option>
              <el-option label="未缴费" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="title === '车位缴费' && userType === '2'" label="我的回复:">
            <el-input type="textarea" v-model="detailForm.reply" autocomplete="off" />
          </el-form-item>
          <el-form-item label="通知缴费:" v-if="userType === '1'">
            <el-input type="textarea" v-model="detailForm.note" autocomplete="off" />
          </el-form-item>
        </el-form>
        <el-form
          v-if="title === '车位订单详情'"
          :rules="rules"
          :model="detailForm"
          label-width="100px"
        >
          <el-form-item label="开始时间:" prop="startdate">
            <el-input
              disabled
              v-model="detailForm.startdate"
              :prefix-icon="Calendar"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="结束时间:" prop="enddate">
            <el-input
              disabled
              v-model="detailForm.enddate"
              :prefix-icon="Calendar"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="应缴金额:" prop="orderpay">
            <el-input disabled v-model="detailForm.orderpay" autocomplete="off" />
          </el-form-item>
          <el-form-item label="缴费状态:" prop="orderstatus">
            <el-select :disabled="payIs" v-model="detailForm.orderstatus" placeholder="请选择">
              <el-option label="已缴费" :value="1"></el-option>
              <el-option label="未缴费" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="title === '车位订单详情'" label="用户回复:">
            <el-input disabled type="textarea" v-model="detailForm.reply" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="Outdialog">关闭</el-button>
            <el-button v-if="title === '车位缴费'" type="primary" @click="updateOrder"
              >缴费</el-button
            >
            <el-button v-if="title === '车位订单通知'" type="primary" @click="noticeOrder"
              >通知</el-button
            >
            <el-button
              v-if="title === '车位缴费' || title === '车位订单通知'"
              type="primary"
              @click="resetOreder"
              >重置</el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>
    <!-- 管理员缴费 -->
    <div class="dialog">
      <el-dialog v-model="dialogVisibleManger" :title="title" width="800">
        <el-form
          ref="MruleForm"
          :rules="Rrules"
          v-if="title === '车位缴费' || title === '车位订单通知'"
          :model="detailForm"
          label-width="100px"
        >
          <!-- 关键修复：为每个需要验证的表单项添加prop属性 -->
          <el-form-item label="开始时间:" prop="startdate">
            <el-date-picker
              :disabled="userType === '2'"
              v-model="detailForm.startdate"
              type="date"
              placeholder="请选择"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="结束时间:" prop="enddate">
            <el-date-picker
              :disabled="userType === '2'"
              v-model="detailForm.enddate"
              type="date"
              placeholder="请选择"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="应缴金额:" prop="orderpay">
            <el-input
              :disabled="userType === '2'"
              v-model="detailForm.orderpay"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="通知内容:" v-if="userType === '2'">
            <el-input type="textarea" disabled v-model="detailForm.note" autocomplete="off" />
          </el-form-item>
          <el-form-item label="缴费状态:" prop="orderstatus">
            <el-select :disabled="payIs" v-model="detailForm.orderstatus" placeholder="请选择">
              <el-option label="已缴费" :value="1"></el-option>
              <el-option label="未缴费" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="title === '车位缴费' && userType === '2'" label="我的回复:">
            <el-input type="textarea" v-model="detailForm.reply" autocomplete="off" />
          </el-form-item>
          <el-form-item label="通知缴费:" v-if="userType === '1'">
            <el-input type="textarea" v-model="detailForm.note" autocomplete="off" />
          </el-form-item>
        </el-form>
        <el-form
          v-if="title === '车位订单详情'"
          :rules="rules"
          :model="detailForm"
          label-width="100px"
        >
          <el-form-item label="开始时间:" prop="startdate">
            <el-input
              disabled
              v-model="detailForm.startdate"
              :prefix-icon="Calendar"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="结束时间:" prop="enddate">
            <el-input
              disabled
              v-model="detailForm.enddate"
              :prefix-icon="Calendar"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="应缴金额:" prop="orderpay">
            <el-input disabled v-model="detailForm.orderpay" autocomplete="off" />
          </el-form-item>
          <el-form-item label="缴费状态:" prop="orderstatus">
            <el-select :disabled="payIs" v-model="detailForm.orderstatus" placeholder="请选择">
              <el-option label="已缴费" :value="1"></el-option>
              <el-option label="未缴费" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="title === '车位订单详情'" label="用户回复:">
            <el-input disabled type="textarea" v-model="detailForm.reply" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="ManOutdialog">关闭</el-button>
            <el-button v-if="title === '车位缴费'" type="primary" @click="updateOrder"
              >缴费</el-button
            >
            <el-button
              v-if="title === '车位订单通知'"
              type="primary"
              @click="noticeOrder(MruleForm)"
              >通知</el-button
            >
            <el-button
              v-if="title === '车位缴费' || title === '车位订单通知'"
              type="primary"
              @click="MresetOreder(MruleForm)"
              >重置</el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Search, DocumentCopy, RefreshRight, Calendar } from '@element-plus/icons-vue'
import { getOrder, updatepayOrder, notifyOrder } from '@/api/parking/order'
import type { ComponentSize } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const userType = localStorage.getItem('type')

const MruleForm = ref<FormInstance>()
const Rrules = ref<FormRules>({
  orderstatus: [{ required: true, message: '请选择缴费状态', trigger: 'change' }],
  startdate: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  enddate: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  orderpay: [{ required: true, message: '请输入应缴金额', trigger: 'change' }],
})

const dialogVisible = ref(false)
const dialogVisibleManger = ref(false)
const title = ref('')
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)
const form = ref({
  parkname: '',
  orderpay: '',
  orderstatus: null,
})
const detailForm = ref({
  startdate: '',
  enddate: '',
  orderpay: '',
  note: '',
  orderstatus: null,
  reply: '',
  id: null,
})
const rules = {
  orderstatus: [{ required: true, message: '请选择缴费状态', trigger: 'change' }],
  startdate: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  enddate: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  orderpay: [{ required: true, message: '请输入应缴金额', trigger: 'change' }],
}

const query = ref({
  parkname: '',
  orderstatus: null,
  orderpay: '',
  currPage: 0,
  pageNum: 10,
})

const tableData = ref([])

// 时间格式化函数（加8小时）
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

const getOrderData = () => {
  getOrder(query.value).then((res) => {
    tableData.value = res.data
    total.value = res.total
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  query.value.pageNum = val
  getOrderData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  query.value.currPage = val - 1
  getOrderData()
}

// 查询
const SearchForm = () => {
  query.value.parkname = form.value.parkname
  query.value.orderpay = form.value.orderpay
  query.value.orderstatus = form.value.orderstatus
  getOrderData()
}
// 重置
const ResetForm = () => {
  form.value.parkname = ''
  form.value.orderpay = ''
  form.value.orderstatus = null
  query.value.parkname = ''
  query.value.orderpay = ''
  query.value.orderstatus = null
  query.value.currPage = 0
  query.value.pageNum = 10
  getOrderData()
}

// 导出
const ExportForm = () => {
  ElMessageBox.confirm('确定全量导出excel文件?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ElMessage({
        message: '导出成功',
        type: 'success',
      })
    })
    .catch(() => {
      ElMessage({
        message: '已取消全量导出',
        type: 'info',
      })
    })
}

const payIs = ref(false)
// 车位缴费
const getPay = (row: any) => {
  title.value = '车位缴费'
  payIs.value = false
  dialogVisible.value = true
  detailForm.value.startdate = formatDateTime(row.startdate).split(' ')[0]
  detailForm.value.enddate = formatDateTime(row.enddate).split(' ')[0]
  detailForm.value.orderpay = row.orderpay
  detailForm.value.note = row.note
  detailForm.value.orderstatus = row.orderstatus
  detailForm.value.reply = row.reply
  detailForm.value.id = row.id
}

// 通知缴费
const noticePay = (row: any) => {
  title.value = '车位订单通知'
  payIs.value = false
  dialogVisibleManger.value = true
  // 清空表单验证
  MruleForm.value?.resetFields()
  detailForm.value.startdate = formatDateTime(row.startdate).split(' ')[0]
  detailForm.value.enddate = formatDateTime(row.enddate).split(' ')[0]
  detailForm.value.orderpay = row.orderpay
  detailForm.value.note = row.note
  detailForm.value.orderstatus = row.orderstatus
  detailForm.value.id = row.id
}

// 缴费详情
const getDetail = (row: any) => {
  title.value = '车位订单详情'
  payIs.value = true
  dialogVisible.value = true
  detailForm.value.startdate = formatDateTime(row.startdate).split(' ')[0]
  detailForm.value.enddate = formatDateTime(row.enddate).split(' ')[0]

  detailForm.value.orderpay = row.orderpay || '暂无'
  detailForm.value.note = row.note
  detailForm.value.orderstatus = row.orderstatus
  detailForm.value.reply = row.reply
  detailForm.value.id = row.id
}

// 关闭模态框
const Outdialog = () => {
  dialogVisible.value = false
  payIs.value = false
  getOrderData()
}

// 管理员关闭
const ManOutdialog = () => {
  dialogVisibleManger.value = false
  payIs.value = false
  getOrderData()
}


// 缴费
const updateOrder = () => {
  ElMessageBox.confirm('确定缴费该车位?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      updatepayOrder({
        u_id: detailForm.value.id,
        orderstatus: detailForm.value.orderstatus,
        reply: detailForm.value.reply,
        token: localStorage.getItem('token'),
      })
        .then((res) => {
          ElMessage({
            message: '车位缴费成功',
            type: 'success',
          })
          nextTick(() => {
            dialogVisible.value = false
            getOrderData() // 更新数据
          })
        })
        .catch((err) => {
          ElMessage({
            message: '车位缴费失败',
            type: 'error',
          })
        })
    })
    .catch(() => {})
}

// 通知
const noticeOrder = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      notifyOrder({
        u_id: detailForm.value.id,
        startdate: detailForm.value.startdate,
        enddate: detailForm.value.enddate,
        orderpay: detailForm.value.orderpay,
        orderstatus: detailForm.value.orderstatus,
        note: detailForm.value.note,
        token: localStorage.getItem('token'),
      })
        .then((res) => {
          ElMessage({
            message: '通知成功',
            type: 'success',
          })
          dialogVisibleManger.value = false
          getOrderData() // 更新数据
        })
        .catch((err) => {
          ElMessage({
            message: err,
            type: 'error',
          })
        })
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 重置
const resetOreder = () => {
  detailForm.value.startdate = ''
  detailForm.value.enddate = ''
  detailForm.value.orderpay = ''
  detailForm.value.note = ''
  detailForm.value.orderstatus = null
  detailForm.value.reply = ''
  detailForm.value.id = null
}

// 管理员重置
const MresetOreder = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  detailForm.value.startdate = ''
  detailForm.value.enddate = ''
  detailForm.value.orderpay = ''
  detailForm.value.note = ''
  detailForm.value.orderstatus = null
  detailForm.value.reply = ''
  detailForm.value.id = null
  
}

// 表格缴费状态按钮
const changePaytype = (row:any) => {
  ElMessageBox.confirm('确定缴费该车位?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    updatepayOrder({
      u_id: row.id,
      orderstatus: row.orderstatus,
      token: localStorage.getItem('token'),
    }).then(() => {
      ElMessage({
        message: '车位缴费成功',
        type: 'success',
      })
      getOrderData() // 更新数据
    }).catch(() => {
      ElMessage({
        message: '车位缴费失败',
        type: 'error',
      })
    })
  }).catch(() => {
    // 还原按钮状态
    if (row.orderstatus === 1) {
      row.orderstatus = 2
    } else {
      row.orderstatus = 1
    }
  })
}


onMounted(() => {
  getOrderData()
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

// 表格
:deep(.el-table th.el-table__cell) {
  background: rgb(238, 241, 246);
  color: rgb(31, 45, 61);
  border-color: rgb(223, 230, 236);
}
:deep(.el-table .el-table__cell) {
  padding: 5px 0 !important;
}
.page {
  margin-top: 30px;
  display: flex;
  justify-content: right;
  padding-right: 20px;
}
</style>