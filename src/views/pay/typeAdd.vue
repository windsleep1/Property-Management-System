<template>
  <div class="content">
    <div class="top">
      <div class="detail">
        <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="新增计费项目" name="add">
            <el-form
              label-width="150px"
              label-position="right"
              ref="ruleFormRef"
              :model="ruleForm"
              :rules="rules"
              style="width: 90%;"
            >
              <el-row>
                <el-col :span="12">
                  <el-form-item label="计费项目名称:" prop="payname">
                    <el-input clearable v-model="ruleForm.payname"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目优先级:" prop="paylevel">
                    <el-input clearable v-model="ruleForm.paylevel"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="项目用量/时长:" prop="paynum">
                    <el-input clearable v-model="ruleForm.paynum"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目价格:" prop="paymoney">
                    <el-input clearable v-model="ruleForm.paymoney"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="通知状态:" prop="paystatus">
                    <el-select placeholder="请选择状态" clearable v-model="ruleForm.paystatus">
                      <el-option label="未通知" :value="2"></el-option>
                      <el-option label="已通知" :value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="计费目录:" prop="c_id">
                    <el-select placeholder="请选择计费目录" clearable v-model="ruleForm.c_id">
                      <el-option label="电费目录" :value="7"></el-option>
                      <el-option label="水费固定月目录" :value="8"></el-option>
                      <el-option label="水费按量目录" :value="9"></el-option>
                      <el-option label="天然气目录" :value="10"></el-option>
                      <el-option label="物业费目录" :value="11"></el-option>
                      <el-option label="宽带费目录" :value="12"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="咨询问候:">
                <Toolbar
                  style="border: 1px solid #ccc"
                  :editor="editorRef"
                  :defaultConfig="toolbarConfig"
                  mode="default"
                />

                <Editor
                  style="width:100%;height: 300px; overflow-y: hidden;border: 1px solid #ccc"
                  v-model="ruleForm.paycontent"
                  :defaultConfig="editorConfig"
                  mode="default"
                  @onCreated="editorInit"
                />
              </el-form-item>
            </el-form>
            <div style="margin-top: 20px;"></div>
            <el-button
              @click="goback"
              type="primary"
              :icon="TopLeft"
              style="position: absolute; top: 20px; right: 20px"
              >返回</el-button
            >
            <el-button
              @click="submitForm(ruleFormRef)"
              type="primary"
              :icon="Document"
              style="position: absolute; top: 60px; right: 20px"
              >保存</el-button
            >
            <el-button
              @click="submitForm(ruleFormRef)"
              type="primary"
              :icon="Promotion"
              style="position: absolute; top: 100px; right: 20px"
              >提交</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { addPay } from '@/api/pay/type'
import { useRoute } from 'vue-router'
import route from '@/router/index'
import { Document, Promotion, TopLeft } from '@element-plus/icons-vue'
import hljs from "highlight.js"
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

const editorRef = shallowRef()

const activeName = ref('add')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = ref({
  payname: '',
  paylevel: '',
  paynum: '',
  paymoney: '',
  paystatus: null,
  paycontent: '',
  c_id: null,
})
const rules = ref({
  payname: [{ required: true, message: '请输入计费项目名称', trigger: 'blur' }],
  paylevel: [{ required: true, message: '请输入项目优先级', trigger: 'blur' }],
  paynum: [{ required: true, message: '请输入项目用量/时长', trigger: 'blur' }],
  paymoney: [{ required: true, message: '请输入项目价格', trigger: 'blur' }],
  paystatus: [{ required: true, message: '请选择通知状态', trigger: 'blur' }],
  c_id: [{ required: true, message: '请选择计费目录', trigger: 'blur' }],
})
// const route = useRoute()


const goback = () => {
  route.push({ name: 'type' })
}

// 工具栏和编辑栏 配置
const toolbarConfig = {
  excludeKeys: [],
}
const editorConfig = { }

// 组件销毁时，也销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

// 编辑器初始化完成时的回调函数
const editorInit = (editor) => {
  editorRef.value = editor // 记录 editor 实例
}

// 使用highlight.js渲染所有<pre><dode>代码块
  const vHigelight = {
  mounted(el) {
    let blocks = el.querySelectorAll('pre code')
    blocks.forEach((block)=>{
      block.setAttribute('style', 'margin-top: 8px;')
      hljs.highlightBlock(block)
    })
  }
}

// 表单提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      ElMessageBox.confirm('确定保存计费信息吗?','提示',{
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        addPay({
            ...ruleForm.value,
            token: localStorage.getItem('token')
        }).then(res => {
            goback()
            ElMessage.success('计费项目新增成功')
            goback()
        }).catch(err => {
            goback()
            ElMessage.error(err)
        })
      }).catch(() => {

      })
    } else {
      console.log('error submit!', fields)
    }
  })
}



onMounted(() => {
  
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
:deep(.w-e-scroll) {
    overflow-y:hidden !important;
}
</style>