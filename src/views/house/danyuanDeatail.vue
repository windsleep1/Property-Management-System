<template>
  <div class="content">
    <div class="top">
      <div class="detail">
        <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="单元详情" name="detail">
            <el-form label-width="110px" label-position="right" ref="ruleFormRef" :model="ruleForm" :rules="rules">
              <el-form-item label="小区名称:" prop="communityname">
                <span>{{ ruleForm.communityname }}</span>
              </el-form-item>
              <el-form-item label="单元名称:" prop="unitname">
                <span>{{ ruleForm.unitname }}</span>
              </el-form-item>
              <el-form-item label="栋数:" prop="unitnum">
                <span>{{ ruleForm.unitnum }}</span>
              </el-form-item>
              <el-form-item label="状态:" prop="unitstatus">
                <span>{{ ruleForm.unitstatus == 2 ? '未建成' : '已建成' }}</span>
              </el-form-item>
              <el-form-item label="咨询问候:">
                <p v-html="ruleForm.unitcontext"></p>
              </el-form-item>
            </el-form>
            <el-button @click="goback" type="primary" :icon="TopLeft" style="position: absolute;top: 20px;right: 20px;">返回</el-button>
            <el-button
              v-if="userType === '1'"
              @click="goEdit"
              type="primary"
              :icon="Document"
              style="position: absolute; top: 60px; right: 20px"
              >编辑</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { getUnitDetail } from '@/api/house/danyuan'
import { useRoute } from 'vue-router';
import router from '@/router/index'
import {
  Document,
  TopLeft
} from '@element-plus/icons-vue'

const userType = localStorage.getItem('type')

const activeName = ref('detail')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const ruleForm = ref({
    communityname: '',
    unitname: '',
    unitnum: '',
    unitstatus: null,
    unitcontext:''
})
const rules = ref({
    communityname: [
        { required: true, message: '请输入小区名称', trigger: 'blur' },
    ],
    unitname: [
        { required: true, message: '请输入单元名称', trigger: 'blur' },
    ],
    unitnum: [
        { required: true, message: '请输入栋数', trigger: 'blur' },
    ],
    unitstatus: [
        { required: true, message: '请选择状态', trigger: 'change' },
    ],
})
const route = useRoute();
const getDetail = () => {
    // 从地址栏中获取id ,传参方式是query
    const obj = {
        id: route.query.detailId,
        token: localStorage.getItem('token')
    }

    getUnitDetail(obj).then(res => {
        ruleForm.value.communityname = res[0].communityname
        ruleForm.value.unitname = res[0].unitname
        ruleForm.value.unitnum = res[0].unitnum
        ruleForm.value.unitstatus = res[0].unitstatus
        ruleForm.value.unitcontext = res[0].unitcontext
    }).catch(err => {
        console.log(err)
    })
}

const goback = () => {
    router.push({ name: 'unit' })
}

// 跳转编辑
const goEdit = () => {
  router.push({
    path:'/home/house/unitEdit',
    query: {
      type: 'DETAIL',
      detailId: route.query.detailId
    }
  })
}

onMounted(() => {
    getDetail()
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
</style>