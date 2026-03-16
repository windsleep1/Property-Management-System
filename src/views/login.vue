<template>
  <div>
    <div id="demo"></div>
    <div class="content">
      <h1 style="text-align: center">欢迎登录小区物业管理系统</h1>
      <el-form ref="ruleForm" :rules="rules" :model="form" label-width="80" style="">
        <el-form-item label="账号" class="user" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入账号"
            style="width: 390px; height: 40px"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" class="lock" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="请输入密码"
            show-password
            style="width: 390px; height: 40px"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="验证码" class="key" prop="code">
          <el-row :span="24">
            <el-col :span="14">
              <el-input
                v-model="form.code"
                placeholder="请输入4位验证码"
                style="width: 270px; height: 40px"
              >
                <template #prefix>
                  <el-icon class="Key"><Key /></el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="10">
              <div class="code" @click="refreshCode">
                <SIdentify :identifyCode="identifyCode"></SIdentify>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <div style="text-align: center; margin-top: 50px">
          <el-button
            type="primary"
            @click="submitForm(ruleForm)"
            style="padding: 0 50px; height: 35px; margin-right: 15px"
            >登录</el-button
          >
          <el-button
            type="danger"
            @click="resetForm(ruleForm)"
            style="padding: 0 50px; height: 35px"
            >重置</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import SIdentify from '@/utils/Sidentify.vue'
import { ref, onMounted, reactive } from 'vue'
import { Particle } from 'jparticles'
import { User, Lock, Key } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { login } from '@/api/login.ts'
import { ElMessage } from 'element-plus'
import router from '@/router/index'

let identifyCode = ref('')
let identifyCodes = ref('1234567890abcdefghijklmnopqrstuvwxyz')

// 生成随机数
const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

// 随机生成验证码字符串
const generateCode = (chars, length) => {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[randomNum(0, chars.length - 1)]
  }
  return result
}

// 更新验证码
const refreshCode = () => {
  identifyCode.value = generateCode(identifyCodes.value, 4)
}

const ruleForm = ref<FormInstance>()
const form = ref({
  username: 'admin',
  password: '123456',
  // Aa@123456
  // 管理员账号：admin01
  // 密码：123456
  code: '',
})
const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})

const lizi = () => {
  new Particle('#demo')
}

Object.assign(Particle.defaultConfig, {
  opacity: 1,
  color: ['white'],
  // 两粒子圆心点之间的直线距离
  proximity: 90,
  // 定位点半径 100 以内（包含）的所有粒子，圆心点之间小于等于 proximity 值，则连线
  range: 100,
  // ...其他属性
})

// 登录
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (form.value.code !== identifyCode.value) {
        ElMessage({
          message: '验证码错误',
          type: 'error',
        })
        // 验证码错误时自动刷新验证码
        refreshCode()
      } else {
        login({ username: form.value.username, password: form.value.password })
          .then((res: any) => {
            ElMessage({
              message: '登陆成功',
              type: 'success',
            })
            localStorage.setItem('token', res.jwt_token)
            localStorage.setItem('username', res.loginData[0].username)
            localStorage.setItem('id', res.loginData[0].id)
            localStorage.setItem('type', res.loginData[0].type)
            router.push({
              path: '/home/shouye',
            })
          })
          .catch((err: any) => {
            ElMessage({
              message: '用户名账号或密码错误',
              type: 'error',
            })
          })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 重置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  form.value.username = ''
  form.value.password = ''
  form.value.code = ''
  // 重置时刷新验证码
  refreshCode()
}

onMounted(() => {
  lizi()
  // identifyCode.value = ''
  // makeCode(identifyCodes.value, 4)
  refreshCode()
})
</script>

<style scoped lang="scss">
#demo {
  width: 100vw;
  height: 100vh;
  background: url('/loginbg.jpg') no-repeat center;
  background-size: cover;
}
.content {
  width: 600px;
  height: 400px;
  background-color: hsla(0, 0%, 100%, 0.85);
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  box-shadow: 0 0 25px #909399;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  padding: 20px;
}
// :deep(.user .el-input__inner),
// :deep(.lock .el-input__inner),
// :deep(.key .el-input__inner) {

// }
.user,
.lock,
.key {
  margin-left: 40px;
  margin-top: 30px;
}
.code {
  width: 120px;
  height: 40px;
  margin-left: 26px;
}
</style>