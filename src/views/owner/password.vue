<template>
  <div class="content">
    <div class="top">
      <el-tabs
        style="box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04)"
        v-model="activeName"
        type="border-card"
        class="demo-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane label="密码修改" name="password">
          <el-form
            ref="ruleFormRef"
            :rules="rules"
            label-width="200px"
            :model="form"
            style="margin-left: 20px; margin-top: 50px; width: 50%"
          >
            <el-form-item
              label="旧密码:"
              prop="oldPwd"
              style="position: relative; margin-bottom: 40px"
            >
              <el-input show-password type="password" v-model="form.oldPwd"></el-input>
              <span v-if="userType === '2'" @click="goFeedBack" class="forget">忘记密码？请联系管理员修改密码</span>
            </el-form-item>
            <el-form-item label="新密码:" prop="newPwd" style="margin-bottom: 40px">
              <el-input show-password type="password" v-model="form.newPwd"></el-input>
            </el-form-item>
            <el-form-item label="确认密码:" prop="confirmPwd" style="margin-bottom: 40px">
              <el-input show-password type="password" v-model="form.confirmPwd"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                style="padding: 0 40px; margin-left: 120px"
                type="primary"
                @click="submitForm(ruleFormRef)"
                >保存</el-button
              >
              <el-button
                style="padding: 0 40px; margin-left: 12%"
                type="primary"
                @click="resetForm(ruleFormRef)"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { changePassword } from '@/api/owner/password'
import router from '@/router/index'
import { ElMessage, ElMessageBox } from 'element-plus'

const userType = localStorage.getItem('type')

const activeName = ref('password')

const form = ref({
  oldPwd: '',
  newPwd: '',
  confirmPwd: '',
})

const rules = ref({
  oldPwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPwd: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('不能少于8位，必须包含数字、特殊字符、小写字母及大写字母'))
          return
        }

        // 统一验证密码长度和复杂度
        if (value.length < 8) {
          callback(new Error('不能少于8位，必须包含数字、特殊字符、小写字母及大写字母'))
          return
        }

        // 验证密码复杂度
        const hasNumber = /[0-9]/.test(value)
        const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)
        const hasLowerCase = /[a-z]/.test(value)
        const hasUpperCase = /[A-Z]/.test(value)

        if (!hasNumber || !hasSpecialChar || !hasLowerCase || !hasUpperCase) {
          callback(new Error('不能少于8位，必须包含数字、特殊字符、小写字母及大写字母'))
          return
        }

        callback()
      },
      trigger: 'blur',
    },
  ],
  confirmPwd: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入密码'))
          return
        }

        if (value !== form.value.newPwd) {
          callback(new Error('两次密码输入不一致'))
          return
        }

        callback()
      },
      trigger: 'blur',
    },
  ],
})
const ruleFormRef = ref<FormInstance>()

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      ElMessageBox.confirm('确认修改密码?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
      })
        .then(() => {
          changePassword({
            id: localStorage.getItem('id'),
            oldPwd: form.value.oldPwd,
            newPwd: form.value.newPwd,
            token: localStorage.getItem('token'),
          })
            .then(() => {
              ElMessage({
                type: 'success',
                message: '修改密码成功!',
              })
            })
            .catch((err) => {
              ElMessage({
                type: 'error',
                message: err,
              })
            })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消修改',
          })
        })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  form.value.oldPwd = ''
  form.value.newPwd = ''
  form.value.confirmPwd = ''
}

const handleClick = () => {
  console.log('handleClick')
}

const goFeedBack = () => {
  router.push({
    name: 'feedBack',
  })
}
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
.forget {
  margin-left: 20px;
  font-size: 12px;
  color: #253af9;
  cursor: pointer;
  font-style: oblique;
  position: absolute;
  right: -200px;
}
</style>