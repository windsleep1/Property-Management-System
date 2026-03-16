<template>
  <div class="content">
    <div class="top">
      <div>
        <!-- 搜索框 -->
        <el-row>
          <el-col :span="6" style="margin-right: 20px">
            <el-select
              v-model="Searchform.CharType"
              placeholder="请选择查询类型"
              clearable
              size="large"
            >
              <el-option label="用户账号" value="username"></el-option>
              <el-option label="用户名称" value="nickname"></el-option>
              <el-option label="家庭住址" value="homeaddress"></el-option>
              <el-option label="性别" value="sex"></el-option>
              <el-option label="邮箱" value="email"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input
              v-model="Searchform.inputText"
              placeholder="请输入查询内容"
              clearable
              size="large"
            ></el-input>
          </el-col>
          <el-col :span="11" style="margin-left: 20px">
            <el-button
              type="primary"
              size="large"
              @click="searchForm"
              :icon="Search"
              style="padding: 0 35px"
              >查询</el-button
            >
            <el-button
              type="success"
              size="large"
              @click="addForm"
              :icon="Plus"
              style="padding: 0 35px"
              >新增</el-button
            >
            <el-button
              type="primary"
              size="large"
              @click="clearForm"
              :icon="Refresh"
              style="padding: 0 35px"
              >重置</el-button
            >
          </el-col>
        </el-row>
      </div>
      <div class="table">
        <el-table stripe border :data="tableData" style="width: 100%">
          <el-table-column
            label="序号"
            width="60"
            header-align="center"
            align="center"
            show-overflow-tooltip
          >
            <template #default="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column
            width="190"
            label="用户账号"
            prop="username"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            width="160"
            label="用户名称"
            prop="nickname"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            width="70"
            label="性别"
            prop="sex"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            width="210"
            label="家庭住址"
            prop="homeaddress"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            width="220"
            label="邮箱"
            prop="email"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            width="234"
            label="描述"
            prop="note"
            header-align="center"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            width="120"
            label="类型"
            prop="type"
            header-align="center"
            align="center"
            show-overflow-tooltip
          >
            <template #default="scope">{{ scope.row.type == 2 ? '普通用户' : '管理员' }}</template>
          </el-table-column>
          <el-table-column
            width=""
            label="操作"
            header-align="center"
            align="center"
            show-overflow-tooltip
          >
            <template #default="scope">
              <el-button size="small" @click="editForm(scope.row)">编辑</el-button>
              <el-button
                style="color: rgb(98, 168, 234)"
                size="small"
                @click="detailForm(scope.row)"
                >详情</el-button
              >
              <el-button style="color: red" size="small" @click="deleteForm(scope.row)"
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
          :page-sizes="[5, 10, 20, 50]"
          :size="size"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next,jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- 模态框 -->
      <el-dialog :title="title" v-model="dialogVisible" width="800">
        <el-form
          ref="ruleFormRef"
          :model="DialogForm"
          label-width="100px"
          style="margin-top: 20px"
          :rules="rules"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户账号" prop="username">
                <el-input v-model="DialogForm.username" :disabled="isDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户密码" prop="password">
                <el-input type="password" show-password v-model="DialogForm.password" :disabled="isDisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户名称" prop="nickname">
                <el-input v-model="DialogForm.nickname" :disabled="isDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="sex">
                <el-select v-model="DialogForm.sex" :disabled="isDisabled">
                  <el-option label="男" :value="'男'"></el-option>
                  <el-option label="女" :value="'女'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="类型" prop="type">
                <el-select v-model="DialogForm.type" placeholder="请选择类型" :disabled="isDisabled">
                  <el-option label="普通用户" :value="'2'"></el-option>
                  <el-option label="管理员" :value="'1'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="家庭住址">
                <el-input v-model="DialogForm.homeaddress" :disabled="isDisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="DialogForm.email" :disabled="isDisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="用户描述" prop="note">
                <el-input type="textarea" v-model="DialogForm.note" :disabled="isDisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="margin-top: 40px; text-align: right">
              <el-button v-if="title === '新增用户' || title === '用户信息编辑'" type="primary" @click="dialogVisible = false">取消</el-button>
              <el-button v-if="title === '新增用户' || title === '用户信息编辑'" type="primary" @click="submitForm(ruleFormRef)">{{ title === '新增用户' ? '提交' : '保存' }}</el-button>
              <el-button v-if="title === '新增用户' || title === '用户信息编辑'" type="primary" @click="resetForm(ruleFormRef)">重置</el-button>
              <el-button v-if="title === '用户信息查看'" type="primary" @click="dialogVisible = false">关闭</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Refresh, Search } from '@element-plus/icons-vue'
import { ref, reactive, onMounted,nextTick } from 'vue'
import { getUsersByTypeChar, getUsersByTypePage,addUser,updateUser,deleteUser } from '@/api/user/user'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

const Searchform = ref({
  type: 1,
  CharType: '',
  inputText: '',
  pageNum: 10,
  currPage: 0,
  token: localStorage.getItem('token'),
})
const form = ref({
  type: 1,
  pageNum: 10,
  currPage: 0,
})

const tableData = ref([])

const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const size = ref<ComponentSize>('default')
const disabled = ref(false)
const background = ref(true)

const dialogVisible = ref(false)
const title = ref('')

const DialogForm = ref({
  username: '',
  password: '',
  nickname: '',
  sex: '',
  homeaddress: '',
  type: '1',
  email: '',
  note: '',
  token: localStorage.getItem('token'),
})
const ruleFormRef = ref<FormInstance>()
const rules = ref<FormRules>({
  username: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
})

const isDisabled = ref(false)

const editId = ref('')

const getTableData = () => {
  getUsersByTypePage(form.value).then((res: any) => {
    tableData.value = res.data
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

const searchForm = () => {
  Searchform.value.currPage = 0
  Searchform.value.pageNum = pageSize.value
  getUsersByTypeChar(Searchform.value).then((res: any) => {
    tableData.value = res.data
    total.value = res.total
  })
}
const addForm = () => {
  title.value = '新增用户'
  dialogVisible.value = true
  isDisabled.value = false
  DialogForm.value = {
    username: '',
    password: '',
    nickname: '',
    sex: '',
    homeaddress: '',
    type: '1',
    email: '',
    note: '',
    token: localStorage.getItem('token'),
  }
  ruleFormRef.value?.resetFields()
}

const clearForm = () => {
  Searchform.value.CharType = ''
  Searchform.value.inputText = ''
  getTableData()
}

const editForm = (row: any) => {
  title.value = '用户信息编辑'
  dialogVisible.value = true
  isDisabled.value = false
  DialogForm.value = {
    username: row.username,
    password: row.password,
    nickname: row.nickname,
    sex: row.sex,
    homeaddress: row.homeaddress,
    type: row.type,
    email: row.email,
    note: row.note,
    token: localStorage.getItem('token'),
  }
  ruleFormRef.value?.resetFields()
  editId.value = row.id
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (title.value === '新增用户') {
        addUser(DialogForm.value).then((res: any) => {
          ElMessage.success('新增用户成功')
          dialogVisible.value = false
          nextTick(() => {
            getTableData()
          })
        }).catch((err:any) => {
          ElMessage.error('新增用户失败')
          console.log(err)
        })
      }else if (title.value === '用户信息编辑') {
        updateUser({
          u_id: editId.value,
          ...DialogForm.value
        }).then((res: any) => {
          ElMessage.success('用户信息编辑成功')
          dialogVisible.value = false
          nextTick(() => {
            getTableData()
          })
        }).catch((err:any) => {
          ElMessage.error('用户信息编辑失败')
          console.log(err)
        })
      }
    } else {
      // console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  DialogForm.value = {
    username: '',
    password: '',
    nickname: '',
    sex: '',
    homeaddress: '',
    type: '1',
    email: '',
    note: '',
    token: localStorage.getItem('token'),
  }
  formEl.resetFields()
}

const detailForm = (row: any) => {
  title.value = '用户信息查看'
  dialogVisible.value = true
  isDisabled.value = true
  DialogForm.value = {
    username: row.username,
    password: row.password,
    nickname: row.nickname,
    sex: row.sex,
    homeaddress: row.homeaddress,
    type: row.type,
    email: row.email,
    note: row.note,
    token: localStorage.getItem('token'),
  }
  ruleFormRef.value?.resetFields()
}
const deleteForm = (row: any) => {
  ElMessageBox.confirm('确认删除该用户吗？', '提示', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    type: 'warning',
  }).then(() => {
    deleteUser({
      u_id: row.id,
      token: localStorage.getItem('token'),
    }).then((res: any) => {
      ElMessage.warning(res)
      nextTick(() => {
        getTableData()
      })
    }).catch((err:any) => {
      ElMessage.error(err)
    })
  }).catch(() => {
    // console.log('cancel')
  })
}

onMounted(() => {
  getTableData()
})
</script>

<style scoped>
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
:deep(.el-textarea__inner) {
  min-height: 100px;
}
</style>