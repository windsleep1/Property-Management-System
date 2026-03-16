<template>
  <div class="content">
    <div class="top">
      <div class="detail">
        <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="新增单元" name="add">
            <el-form
              label-width="110px"
              label-position="right"
              ref="ruleFormRef"
              :model="ruleForm"
              :rules="rules"
              style="width: 90%"
            >
              <el-row>
                <el-col :span="12">
                  <el-form-item label="小区名称:" prop="communityname">
                    <el-input clearable v-model="ruleForm.communityname"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单元名称:" prop="unitname">
                    <el-input clearable v-model="ruleForm.unitname"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="栋数:" prop="unitnum">
                    <el-input clearable v-model="ruleForm.unitnum"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="状态:" prop="unitstatus">
                    <el-select placeholder="请选择状态" clearable v-model="ruleForm.unitstatus">
                      <el-option label="未建成" :value="2"></el-option>
                      <el-option label="已建成" :value="1"></el-option>
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
                  style="width: 100%; height: 300px; overflow-y: hidden; border: 1px solid #ccc"
                  v-model="ruleForm.unitcontext"
                  :defaultConfig="editorConfig"
                  mode="default"
                  @onCreated="editorInit"
                />
              </el-form-item>
            </el-form>
            <div style="margin-top: 20px"></div>
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
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { getUnitDetail, addUnit } from '@/api/house/danyuan'
import { useRoute } from 'vue-router'
import router from '@/router/index'
import { Document, TopLeft } from '@element-plus/icons-vue'
import hljs from 'highlight.js'
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
  communityname: '',
  unitname: '',
  unitnum: '',
  unitstatus: null,
  unitcontext: '',
})
const rules = ref({
  communityname: [{ required: true, message: '请输入小区名称', trigger: 'blur' }],
  unitname: [{ required: true, message: '请输入单元名称', trigger: 'blur' }],
  unitnum: [{ required: true, message: '请输入栋数', trigger: 'blur' }],
  unitstatus: [{ required: true, message: '请选择状态', trigger: 'blur' }],
})
const route = useRoute()

const goback = () => {
  router.push({ name: 'unit' })
}

// 工具栏和编辑栏 配置
const toolbarConfig = {
  excludeKeys: [],
}
const editorConfig = {}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

// 编辑器初始化完成时的回调函数
const editorInit = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

// 定义指令，自动使用highlight.js渲染所有<pre><dode>代码块
const vHigelight = {
  mounted(el: any) {
    let blocks = el.querySelectorAll('pre code')
    blocks.forEach((block: any) => {
      block.setAttribute('style', 'margin-top: 8px;')
      hljs.highlightBlock(block)
    })
  },
}

// 表单提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      ElMessageBox.confirm('确定提交信息?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      })
        .then(() => {
          addUnit({
            ...ruleForm.value,
            token: localStorage.getItem('token'),
          })
            .then((res) => {
              ElMessage.success('单元信息录入成功')
              goback()
            })
            .catch((err) => {
              ElMessage.error(err)
              goback()
            })
        })
        .catch(() => {})
    } else {
      console.log('error submit!', fields)
    }
  })
}

onMounted(() => {})
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
  overflow-y: hidden !important;
}
</style>