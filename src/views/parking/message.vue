<template>
  <div class="content">
    <div class="top">
      <el-row :span="24">
        <el-col :span="5">
          <div class="left">
            <el-form :model="form" label-position="top" style="margin-bottom: 30px">
              <el-form-item label="车位名:">
                <el-input clearable placeholder="请输入车位名" v-model="form.parkname" />
              </el-form-item>
            </el-form>
            <el-form :model="form" label-position="top" style="margin-bottom: 30px">
              <el-form-item label="车位金额:">
                <el-input clearable placeholder="请输入车位金额" v-model="form.parkpay" />
              </el-form-item>
            </el-form>
            <el-form :model="form" label-position="top" style="margin-bottom: 30px">
              <el-form-item label="车位类型:">
                <el-select v-model="form.parktype" placeholder="请选择车位类型" clearable>
                  <el-option label="地上" :value="2"></el-option>
                  <el-option label="地下" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <el-form :model="form" label-position="top" style="margin-bottom: 30px">
              <el-form-item label="车位状态:">
                <el-select v-model="form.parkstatus" placeholder="请选择车位状态" clearable>
                  <el-option label="未有车" :value="2"></el-option>
                  <el-option label="已有车" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div class="underline"></div>
            <div class="btns">
              <el-button
                @click="SearchParking"
                style="height: 35px; padding: 0 40px"
                type="primary"
                :icon="Search"
                >查询</el-button
              >
              <el-button
                @click="ResetParking"
                style="height: 35px; padding: 0 40px"
                type="primary"
                :icon="Edit"
                >重置</el-button
              >
            </div>
          </div>
        </el-col>
        <el-col :span="19">
          <div class="right">
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-right: 15px;
              "
            >
              <h1>车位列表</h1>
              <el-button v-if="usertype == '1'" @click="Add" type="success" :icon="Plus"
                >新增</el-button
              >
            </div>
            <div class="table">
              <el-table
                v-if="usertype == '2'"
                :max-height="420"
                :header-cell-style="{ backgroundColor: 'rgb(223, 230, 236);', color: 'black' }"
                stripe
                border
                :data="tableData"
                style="width: 98.6%"
                v-loading="parkingLoading"
                element-loading-text="加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
              >
                <el-table-column width="70" label="序号" header-align="center" align="center">
                  <template #default="scope">
                    <span>{{ scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  width="200"
                  sortable
                  label="车位名称"
                  prop="parkname"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  width="180"
                  sortable
                  label="车位金额"
                  prop="parkpay"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  width="336"
                  label="车位类型"
                  prop="parktype"
                  header-align="center"
                  align="center"
                >
                  <template #default="scope">
                    <el-tooltip :content="'park type: ' + scope.row.parktype" placement="top">
                      <el-switch
                        disabled
                        active-text="地下"
                        inactive-text="地上"
                        v-model="scope.row.parktype"
                        :active-value="1"
                        :inactive-value="2"
                        active-color="#13ce66"
                        inactive-color="#ff4949 "
                        style="--el-switch-on-color: ; --el-switch-off-color: #ccc"
                      />
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column
                  width=""
                  label="车位状态"
                  prop="parkstatus"
                  header-align="center"
                  align="center"
                >
                  <template #default="scope">
                    <el-tooltip :content="'park status: ' + scope.row.parkstatus" placement="top">
                      <el-switch
                        disabled
                        active-text="已有车"
                        inactive-text="未有车"
                        v-model="scope.row.parkstatus"
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
              <!-- 管理员 -->
              <el-table
                v-if="usertype === '1'"
                :max-height="420"
                :header-cell-style="{ backgroundColor: 'rgb(223, 230, 236);', color: 'black' }"
                stripe
                border
                :data="tableData"
                style="width: 98.6%"
                v-loading="parkingLoading"
                element-loading-text="加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
              >
                <el-table-column width="70" label="序号" header-align="center" align="center">
                  <template #default="scope">
                    <span>{{ scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  width="200"
                  sortable
                  label="车位名称"
                  prop="parkname"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  width="160"
                  sortable
                  label="车位金额"
                  prop="parkpay"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  width="196"
                  label="车位类型"
                  prop="parktype"
                  header-align="center"
                  align="center"
                >
                  <template #default="scope">
                    <el-tooltip :content="'park type: ' + scope.row.parktype" placement="top">
                      <el-switch
                        active-text="地下"
                        inactive-text="地上"
                        v-model="scope.row.parktype"
                        :active-value="1"
                        :inactive-value="2"
                        active-color="#13ce66"
                        inactive-color="#ff4949 "
                        style="--el-switch-on-color: ; --el-switch-off-color: #ccc"
                        @click="changeParktype(scope.row)"
                      />
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column
                  width="195"
                  label="车位状态"
                  prop="parkstatus"
                  header-align="center"
                  align="center"
                >
                  <template #default="scope">
                    <el-tooltip :content="'park status: ' + scope.row.parkstatus" placement="top">
                      <el-switch
                        active-text="已有车"
                        inactive-text="未有车"
                        v-model="scope.row.parkstatus"
                        :active-value="1"
                        :inactive-value="2"
                        active-color="#13ce66"
                        inactive-color="#ff4949 "
                        style="--el-switch-on-color: ; --el-switch-off-color: #ccc"
                        @click="changeParkstatus(scope.row)"
                      />
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="操作" header-align="center" align="center">
                  <template #default="scope">
                    <el-button
                      @click="goleftCT(scope.row)"
                      :disabled="scope.row.parkstatus === 1"
                      :icon="Share"
                      size="small"
                      >分配车位</el-button
                    >
                    <el-button
                      @click="EditParking(scope.row)"
                      type="primary"
                      :icon="Edit"
                      size="small"
                      >编辑</el-button
                    >
                    <el-button
                      @click="DeleteParking(scope.row)"
                      type="danger"
                      :icon="DeleteFilled"
                      size="small"
                      >移除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[5, 9, 20, 30]"
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
        </el-col>
      </el-row>
    </div>
    <!-- 模态框 -->
    <el-dialog v-model="dialogVisible" :title="title" width="800">
      <el-form
        ref="ruleformRef"
        label-width="100px"
        :model="ruleform"
        style="margin-top: 20px"
        :rules="rules"
      >
        <el-form-item label="车位名称:" prop="parkname" style="margin-bottom: 40px">
          <el-input v-model="ruleform.parkname" clearable />
        </el-form-item>
        <el-form-item label="车位金额:" prop="parkpay" style="margin-bottom: 40px">
          <el-input v-model="ruleform.parkpay" clearable />
        </el-form-item>
        <el-form-item label="车位类型:" prop="parktype" style="margin-bottom: 40px">
          <el-select v-model="ruleform.parktype" placeholder="请选择" clearable>
            <el-option label="地上" :value="2"></el-option>
            <el-option label="地下" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车位状态:" prop="parkstatus" style="margin-bottom: 40px">
          <el-select
            v-if="title == '新增车位'"
            v-model="ruleform.parkstatus"
            placeholder="请选择"
            clearable
          >
            <el-option label="未有车" :value="2"></el-option>
            <el-option disabled label="已有车" :value="1"></el-option>
          </el-select>
          <el-select
            v-if="title == '车位修改'"
            v-model="ruleform.parkstatus"
            placeholder="请选择"
            clearable
          >
            <el-option label="未有车" :value="2"></el-option>
            <el-option label="已有车" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addPark(ruleformRef)">提交</el-button>
          <el-button type="primary" @click="resetPark(ruleformRef)">重置</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 侧边抽屉 -->
    <el-drawer size="768" v-model="drawer" title="车位分配" :direction="direction">
      <div class="usertable">
        <el-table
          ref="userTableRef"
          stripe
          border
          :data="UsertableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loading="userLoading"
          element-loading-text="加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
        >
          <el-table-column
            type="selection"
            width="60"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            width="65"
            type="index"
            label="序号"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            width="123"
            label="用户账号"
            prop="username"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            width="183"
            label="家庭住址"
            prop="homeaddress"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column width="" label="类型" prop="type" header-align="center" align="center">
            <template #default="scope">
              {{ scope.row.type == 1 ? '管理员' : '普通用户' }}
            </template>
          </el-table-column>
          <el-table-column
            width="122"
            label="车位"
            prop="parkname"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </div>
      <div
        calss="userpage"
        style="
          margin-top: 30px;
          display: flex !important;
          justify-content: right;
          padding-right: 20px;
        "
      >
        <el-pagination
          v-model:current-page="usercurrentPage"
          v-model:page-size="userpageSize"
          :page-sizes="[5, 10, 20, 30]"
          :size="usersize"
          :disabled="userdisabled"
          :background="userbackground"
          layout="total, sizes, prev, pager, next, jumper"
          :total="usertotal"
          @size-change="userhandleSizeChange"
          @current-change="userhandleCurrentChange"
        />
      </div>
      <div style="display: flex; justify-content: center; margin-top: 80px">
        <el-button @click="drawer = false" style="padding: 0 100px;margin-right:60px;">取消</el-button>
        <el-button @click="handleAssignParking" style="padding: 0 100px" type="primary">确定</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted,nextTick } from 'vue'
import { Search, Edit, Plus, Share, DeleteFilled } from '@element-plus/icons-vue'
import { getPark, addParking, editParking, delParking, getUser,updateParkStatus } from '@/api/parking/message'
import type { ComponentSize } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { DrawerProps } from 'element-plus'
import type { TableInstance } from 'element-plus'  // 导入表格实例类型

const parkingLoading = ref(true)  // 车位列表加载状态
const userLoading = ref(true)     // 用户表格加载状态

const drawer = ref(false)
const direction = ref<DrawerProps['direction']>('ltr')

const usertype = localStorage.getItem('type')

const u_id = ref(0)
const title = ref('')

const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(9)
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)

// 用户
const usertotal = ref(0)
const usercurrentPage = ref(1)
const userpageSize = ref(10)
const usersize = ref<ComponentSize>('small')
const userbackground = ref(false)
const userdisabled = ref(false)

const userquery = ref({
  currPage: 0,
  pageNum: 10,
})

const form = ref({
  parkname: '',
  parkpay: '',
  parktype: null,
  parkstatus: null,
})
const ruleformRef = ref<FormInstance>()
const ruleform = ref({
  parkname: '',
  parkpay: '',
  parktype: null,
  parkstatus: 2,
})
const dialogVisible = ref(false)
const rules = ref({
  parkname: [{ required: true, message: '请输入车位名称', trigger: 'blur' }],
  parkpay: [{ required: true, message: '请输入车位金额', trigger: 'blur' }],
  parktype: [{ required: true, message: '请选择车位类型', trigger: 'blur' }],
})

const query = ref({
  parkname: '',
  parkpay: '',
  parktype: null,
  parkstatus: null,
  currPage: 0,
  pageNum: 9,
})

const tableData = ref([])
const UsertableData = ref([])

const multipleSelection = ref([])
const userTableRef = ref<TableInstance>()

const ParkId = ref(0)
const ParkName = ref('')
const ParkPay = ref('')
const ParkType = ref(0)

// 车位分配选择
const handleSelectionChange = (val: any) => {
  // 实现单选效果：只保留最后一次选择
  if (val.length > 1) {
    // 获取最后选择的项
    const lastSelected = val[val.length - 1]
    // 清除所有选择
    userTableRef.value?.clearSelection()
    // 只选中最后一项
    userTableRef.value?.toggleRowSelection(lastSelected, true)
    multipleSelection.value = [lastSelected]
  } else {
    multipleSelection.value = val
  }
}


const getparking = () => {
  parkingLoading.value = true  // 开始加载
  getPark(query.value).then((res) => {
    tableData.value = res.data
    total.value = res.total
    parkingLoading.value = false  // 加载完成
  }).catch(err => {
    ElMessage.error('获取车位列表失败,请刷新重试!')
    parkingLoading.value = false  // 加载失败关闭
  })
}

// 获取用户数据
const getUserTable = () => {
  userLoading.value = true  // 开始加载
  getUser(userquery.value).then((res) => {
    UsertableData.value = res.data
    usertotal.value = res.total
    userLoading.value = false  // 加载完成
  }).catch(err => {
    ElMessage.error('获取用户列表失败!')
    userLoading.value = false  // 加载失败关闭
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  query.value.pageNum = val
  getparking()
}
// 用户
const userhandleSizeChange = (val: number) => {
  userpageSize.value = val
  userquery.value.pageNum = val
  getUserTable()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  query.value.currPage = val - 1
  getparking()
}
// 用户
const userhandleCurrentChange = (val: number) => {
  usercurrentPage.value = val
  userquery.value.currPage = val - 1
  getUserTable()
}

// 查询
const SearchParking = () => {
  query.value.parkname = form.value.parkname
  query.value.parkpay = form.value.parkpay
  query.value.parktype = form.value.parktype
  query.value.parkstatus = form.value.parkstatus
  getparking()
}
// 重置
const ResetParking = () => {
  form.value.parkname = ''
  form.value.parkpay = ''
  form.value.parktype = null
  form.value.parkstatus = null
  query.value.parkname = ''
  query.value.parkpay = ''
  query.value.parktype = null
  query.value.parkstatus = null
  query.value.currPage = 0
  query.value.pageNum = 9
  getparking()
}

// 新增
const Add = () => {
  title.value = '新增车位'
  dialogVisible.value = true
  ruleform.value.parkname = ''
  ruleform.value.parkpay = ''
  ruleform.value.parktype = null
  ruleform.value.parkstatus = 2
  ruleformRef.value?.resetFields()
}

// 提交
const addPark = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (title.value == '新增车位') {
        addParking({
          ...ruleform.value,
          token: localStorage.getItem('token'),
        })
          .then((res) => {
            dialogVisible.value = false
            ElMessage.success('新增车位成功!')
            getparking()
          })
          .catch((err) => {
            ElMessage.error('新增车位失败,请重试!')
          })
      } else if (title.value == '车位修改') {
        editParking({
          ...ruleform.value,
          u_id: u_id.value,
          token: localStorage.getItem('token'),
        })
          .then((res) => {
            dialogVisible.value = false
            ElMessage.success('修改车位成功!')
            getparking()
          })
          .catch((err) => {
            ElMessage.error('修改车位失败,请重试!')
          })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 表单重置
const resetPark = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  ruleform.value.parkname = ''
  ruleform.value.parkpay = ''
  ruleform.value.parktype = null
  if (title.value == '新增车位') {
    ruleform.value.parkstatus = 2
  } else if (title.value == '车位修改') {
    ruleform.value.parkstatus = null
  }
}

// 编辑
const EditParking = (row: any) => {
  // console.log(row)
  u_id.value = row.id
  dialogVisible.value = true
  title.value = '车位修改'
  ruleformRef.value?.resetFields()
  ruleform.value.parkname = row.parkname
  ruleform.value.parkpay = row.parkpay
  ruleform.value.parktype = row.parktype
  ruleform.value.parkstatus = row.parkstatus
}

// 删除
const DeleteParking = (row: any) => {
  ElMessageBox.confirm('确定删除该车位?', '提示', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    type: 'warning',
  }).then(() => {
    delParking({
      id: row.id,
      token: localStorage.getItem('token'),
    })
      .then((ref) => {
        ElMessage.success('删除成功!')
        getparking()
      })
      .catch((err) => {
        ElMessage.error('删除失败,请重试!')
      })
  })
}

// 分配车位
const goleftCT = (row: any) => {
  drawer.value = true
  ParkId.value = row.id
  ParkName.value = row.parkname
  ParkPay.value = row.parkpay
  ParkType.value = row.parktype
}

// 确定分配
const handleAssignParking = () => {
  if (multipleSelection.value.length == 0) {
    ElMessageBox.alert('请选择车位!', '提示', {
      confirmButtonText: '确定',
      type: 'warning',
    })
  }else {
    ElMessageBox.confirm('确定分配该车位?', '提示', {
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      type: 'warning',
    }).then(() => {
      updateParkStatus({
        u_id: multipleSelection.value[0].id,
        parkId: ParkId.value,
        parkname: ParkName.value,
        parkstatus: 1,
        token: localStorage.getItem('token'),
      }).then(res => {
        editParking({
          u_id: ParkId.value,
          parkname: ParkName.value,
          parkpay: ParkPay.value,
          parktype: ParkType.value,
          parkstatus: 1,
          token: localStorage.getItem('token'),
        }).then(res => {
          ElMessage.success('车位分配成功!')
          drawer.value = false
          getparking()
          getUserTable()
        }).catch(err => {
          ElMessage.error('车位分配失败,请重试!')
        })
      }).catch(err => {
        ElMessage.error('车位分配失败,请重试!')
      })
    })
  }
}

// 开关改变类型
const changeParktype = (row:any) => {
  editParking({
    u_id: row.id,
    parkname: row.parkname,
    parkpay: row.parkpay,
    parktype: row.parktype,
    parkstatus: row.parkstatus,
    token: localStorage.getItem('token'),
  }).then(res => {
    ElMessage.success('更新信息成功!')
    nextTick(() => {
      getparking()
    })
    
  }).catch(err => {
    ElMessage.error('出现错误,更新失败')
    nextTick(() => {
      getparking()
    })
  })
}

// 开关改变状态
const changeParkstatus = (row:any) => {
  editParking({
    u_id: row.id,
    parkname: row.parkname,
    parkpay: row.parkpay,
    parktype: row.parktype,
    parkstatus: row.parkstatus,
    token: localStorage.getItem('token'),
  }).then(res => {
    ElMessage.success('更新信息成功!')
    nextTick(() => {
      getparking()
    })
  }).catch(err => {
    ElMessage.error('出现错误,更新失败')
    nextTick(() => {
      getparking()
    })
  })
}



onMounted(() => {
  getparking()
  getUserTable()
})
</script>

<style scoped lang="scss">
// .clearfix {
//     display: block;
//     content: '';
//     clear: both;
//     height:0;
//     visibility: hidden;

// }
.content {
  width: 98.6%;
  margin-left: 10px;
  background-color: #fff;
}
.top {
  margin-top: 80px;
  padding: 20px;
}
.left {
  margin-top: 32px;
}
.underline {
  border-bottom: 1px solid #e6e5e5;
  padding: 0 35px;
  margin-top: 15px;
}
.btns {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

// 车位列表
.right {
  padding: 10px 20px;
}
:deep(.el-table th.el-table__cell) {
  background: rgb(238, 241, 246);
  color: rgb(31, 45, 61);
  border-color: rgb(223, 230, 236);
}
:deep(.el-table .el-table__cell) {
  padding: 5px 0 !important;
}
.table {
  margin-top: 10px;
  height: 420px;
}
.page {
  margin-top: 50px;
  display: flex;
  justify-content: right;
  padding-right: 20px;
}
</style>