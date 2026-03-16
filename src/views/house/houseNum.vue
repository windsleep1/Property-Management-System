<template>
  <div class="content">
    <div class="top">
      <el-row>
        <el-col :span="5" style="padding-right: 10px">
          <el-select clearable style="" v-model="form.homestatus" placeholder="入住状态">
            <el-option label="已入住" :value="1"></el-option>
            <el-option label="未入住" :value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input clearable v-model="form.unitname" placeholder="单元名称"></el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            style="margin-left: 25px"
            clearable
            v-model="form.buildnum"
            placeholder="幢号"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            style="margin-left: 50px"
            clearable
            v-model="form.homenum"
            placeholder="房号"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            style="margin-left: 75px"
            clearable
            v-model="form.homename"
            placeholder="住客姓名"
          ></el-input>
        </el-col>
        <el-col :span="7">
          <el-button style="margin-left: 100px" @click="SearchTable" :icon="Search" type="primary"
            >查询</el-button
          >
          <el-button @click="ExportTable" :icon="Upload" type="success">批量导出</el-button>
          <el-button @click="DeleteForm" :icon="DeleteFilled" type="danger">批量删除</el-button>
        </el-col>
      </el-row>
      <div class="table">
        <el-table
          stripe
          border
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="60"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column width="110" header-align="center" align="center" label="序号">
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            header-align="center"
            align="center"
            label="单元名称"
            prop="unitname"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            width="170"
            header-align="center"
            align="center"
            label="幢号"
            prop="buildnum"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ scope.row.buildnum ? scope.row.buildnum : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column
            width="180"
            header-align="center"
            align="center"
            label="楼层号"
            prop="storeynum"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ scope.row.storeynum ? scope.row.storeynum : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column
            width="220"
            header-align="center"
            align="center"
            label="房号"
            prop="homenum"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ scope.row.homenum ? scope.row.homenum : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column
            width="220"
            header-align="center"
            align="center"
            label="住客姓名"
            prop="homename"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ scope.row.homename ? scope.row.homename : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column
            width="160"
            header-align="center"
            align="center"
            label="状态"
            prop="homestatus"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ scope.row.homestatus === 1 ? '已入住' : '未入住' }}
            </template>
          </el-table-column>
          <el-table-column width="" header-align="center" align="center" label="操作">
            <template #default="scope">
              <el-button @click="EditTable(scope.row)" size="small" type="primary">编辑</el-button>
              <el-button @click="DeleteTable(scope.row)" size="small" type="danger">删除</el-button>
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
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import router from '@/router/index'
import { DeleteFilled, Search, Upload } from '@element-plus/icons-vue'
import type { ComponentSize } from 'element-plus'
import { getHouse, searchHouse,deleteHouse } from '@/api/house/houseNum'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import router from '@/router/index'

const form = ref({
  homestatus: null,
  unitname: '',
  buildnum: '',
  homenum: '',
  homename: '',
  currPage: 0,
  pageNum: 10,
  token: localStorage.getItem('token'),
})

const tableData = ref([])
const query = ref({
  currPage: 0,
  pageNum: 10,
})

const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const size = ref<ComponentSize>('default')
const disabled = ref(false)
const background = ref(true)

const multipleSelection = ref([])

const getList = () => {
  getHouse(query.value).then((res: any) => {
    tableData.value = res.data
    total.value = res.total
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  form.value.currPage = 0
  form.value.pageNum = val
  SearchTable()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  form.value.currPage = val - 1
  SearchTable()
}

// 查询
const SearchTable = () => {
  form.value.currPage = 0
  currentPage.value = 1
  searchHouse({
    ...form.value,
  }).then((res) => {
    tableData.value = res.data
    total.value = res.total
  })
}
// 批量导出
const ExportTable = () => {
  if (multipleSelection.value.length === 0) {
    ElMessageBox.alert('请选择要导出的房号信息', '提示', {
      confirmButtonText: '确定',
      callback: (action: Action) => {},
    })
  } else if (multipleSelection.value.length > 0) {
    ElMessageBox.confirm('确定导出excel文件?', '提示', {
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      type: 'warning',
    })
      .then(() => {
        ElMessage({
          type: 'success',
          message: '导出成功',
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消批量导出',
        })
      })
  }
}
// 批量删除
const DeleteForm = () => {
  if (multipleSelection.value.length === 0) {
    ElMessageBox.alert('请选择要删除的房号信息', '提示', {
      confirmButtonText: '确定',
      callback: (action: Action) => {},
    })
  } else if (multipleSelection.value.length > 0) {
    ElMessageBox.confirm('确定删除该房号信息?', '提示', {
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      type: 'warning',
    })
      .then(() => {
        deleteHouse({
            ids: multipleSelection.value.map((item) => item.id),
            token: form.value.token,
        }).then(res => {
            ElMessage({
              type: 'success',
              message: '删除成功',
            })
            multipleSelection.value = []
            query.value.currPage = 0
            query.value.pageNum = form.value.pageNum
            currentPage.value = 1
            getList()
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消删除',
        })
      })
  }
}

// 编辑
const EditTable = (row: any) => {
  router.push({
    path: '/home/house/houseNumEdit',
    query:{
      type: 'DETAIL',
      editId: row.id,
    }
  })
}
// 删除
const DeleteTable = (row: any) => {
  multipleSelection.value.push(row)
  DeleteForm()
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

onMounted(() => {
  //   const role = localStorage.getItem('type')
  //   if (role === '2') {
  //     router.push({
  //       name: 'notFound',
  //     })
  //   }
  getList()
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
.table {
  margin-top: 20px;
}
.page {
  display: flex;
  justify-content: right;
  margin-top: 20px;
  margin-right: 25px;
}
:deep(.el-table th.el-table__cell) {
  background: rgb(238, 241, 246);
  color: rgb(31, 45, 61);
  border-color: rgb(223, 230, 236);
}

:deep(.el-input) {
  width: 200px !important;
}
</style>