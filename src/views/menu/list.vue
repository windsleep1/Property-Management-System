<template>
  <div class="content">
    <div class="top">
      <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="菜单列表" name="list">
          <div class="table">
            <el-table stripe :data="tableData" style="width: 100%">
              <el-table-column
                label="编码"
                width="150"
                header-align="center"
                align="center"
                show-overflow-tooltip
              >
                <template #default="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column
                prop="title"
                label="菜单名称"
                width="267"
                header-align="center"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="prentId"
                label="菜单级别"
                width="265"
                header-align="center"
                align="center"
                show-overflow-tooltip
              >
                <template #default="scope">
                  {{ scope.row.prentId === 0 ? '一级' : '二级' }}
                </template>
              </el-table-column>
              <el-table-column
                prop="desc"
                label="菜单描述"
                width="367"
                header-align="center"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                label="操作"
                width=""
                header-align="center"
                align="center"
                show-overflow-tooltip
              >
                <template #default="scope">
                  <el-button @click="goSecond(scope.$index + 1)" size="small" type="primary" :icon="ZoomIn">查看下一级</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[7, 10, 20, 50]"
              :size="size"
              :disabled="disabled"
              :background="background"
              layout="total, sizes, prev, pager, next,jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ZoomIn } from '@element-plus/icons-vue'
import { ref ,onMounted } from 'vue'
import { getMenu } from '@/api/menu/list'
import type { ComponentSize } from 'element-plus'
import router from '@/router/index'
import { ElMessage, ElMessageBox } from 'element-plus'

const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const size = ref<ComponentSize>('default')
const disabled = ref(false)
const background = ref(false)

const tableData = ref([])

const activeName = ref('list')

const query = ref({
    prentId: 0,
    currPage: 0,
    pageNum: 10
})

const getTableData = () => {
    getMenu(query.value).then((res) => {
        total.value = res.total
        tableData.value = res.data
    })
}

const goSecond = (id) => {
    router.push({
        path: '/home/menu/listSecond',
        query: {
            prentId: id
        }
    })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  query.value.currPage = 0
  query.value.pageNum = val
  getTableData()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  query.value.currPage = val - 1
    getTableData()
}

const handleClick = () => {
  console.log('click')
}

onMounted(() => {
  getTableData()
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
  margin-top: 25px;
  margin-right: 05px;
}
</style>