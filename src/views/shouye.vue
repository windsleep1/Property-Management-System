<template>
  <div class="shouye">
    <div class="gonggao">
      <div>
        <span class="newnotice">
          <el-icon><BellFilled /></el-icon>
          最新公告
        </span>
      </div>
      <div class="notice">
        <div class="donghua" ref="scrollContainer">
          <div class="notice-wrapper" ref="noticeWrapper">
            <div v-for="(item, index) in displayPosts" :key="index" class="notice-item">
              <span class="hidden-cont" style="width: 15%">{{ '· ' + item.title }}</span>
              <span class="hidden-cont" style="width: 40%; margin-left: 8%">{{
                '· ' + item.content
              }}</span>
              <span class="hidden-cont" style="width: 20%; margin-left: 10%"
                >{{
                  '· ' +
                  item.createtime.split('T')[0] +
                  ' ' +
                  item.createtime.split('T')[1].split('.')[0]
                }}
                <span
                  @click="goNotice"
                  class="more-btn"
                  style="
                    font-weight: bold;
                    color: rgb(73, 149, 247);
                    margin-left: 8%;
                    cursor: pointer;
                  "
                  >更多</span
                >
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="cards">
      <el-row style="margin-left: -6px; margin-right: -6px; width: 100%">
        <el-col :span="6" style="padding-left: 6px; padding-right: 6px">
          <el-card shadow="always" style="height: 100%; width: 100%">
            <div class="card-cont">
              <div class="card-icon">
                <el-icon style="color: rgb(56, 154, 249); font-size: 66px"><Avatar /></el-icon>
              </div>
              <div class="card-text">
                <div class="userNum">
                  {{ userNum }}
                </div>
                <div class="dic">系统用户数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6" style="padding-left: 6px; padding-right: 6px">
          <el-card shadow="always" style="height: 100%; width: 100%">
            <div class="card-cont">
              <div class="card-icon">
                <el-icon style="color: rgb(174, 232, 106); font-size: 66px"><Document /></el-icon>
              </div>
              <div class="card-text">
                <div class="userNum">
                  {{ costNum }}
                </div>
                <div class="dic">计费订单数量</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6" style="padding-left: 6px; padding-right: 6px">
          <el-card shadow="always" style="height: 100%; width: 100%">
            <div class="card-cont">
              <div class="card-icon">
                <el-icon style="color: rgb(242, 185, 14); font-size: 66px"><Van /></el-icon>
              </div>
              <div class="card-text">
                <div class="userNum">
                  {{ parkNum }}
                </div>
                <div class="dic">车位总量</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6" style="padding-left: 6px; padding-right: 6px">
          <el-card shadow="always" style="height: 100%; width: 100%">
            <div class="card-cont">
              <div class="card-icon">
                <el-icon style="color: rgb(178, 139, 124); font-size: 66px"><Edit /></el-icon>
              </div>
              <div class="card-text">
                <div class="userNum">
                  {{ feedbackNum }}
                </div>
                <div class="dic">用户反馈数量</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="echarts">
      <el-row style="margin-left: -6px; margin-right: -6px; width: 100%">
        <el-col :span="8" style="padding-left: 6px; padding-right: 6px">
          <el-card shadow="always" style="height: 100%; width: 100%">
            <div class="pie">
              <div
                ref="PieRef"
                :style="{ width: '100%', height: '340px', marginTop: '-15px' }"
                v-loading="pieLoading"
                element-loading-text="加载中..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
              ></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8" style="padding-left: 6px; padding-right: 6px">
          <el-card shadow="always" style="height: 100%; width: 100%">
            <div class="car">
              <h4>车位数/已分配量/已缴费</h4>
              <div
                ref="CarRef"
                :style="{ width: '100%', height: '300px', marginTop: '-22px' }"
                v-loading="carLoading"
                element-loading-text="加载中..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
              ></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8" style="padding-left: 6px; padding-right: 6px">
          <el-card shadow="always" style="height: 100%; width: 100%">
            <div class="cost">
              <div
                ref="CostRef"
                :style="{ width: '100%', height: '290px', marginTop: '-10px' }"
                v-loading="costLoading"
                element-loading-text="加载中..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
              ></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <el-row style="margin-left: -6px; margin-right: -6px; width: 100%">
        <el-col :span="17" style="padding-left: 6px; padding-right: 6px">
          <el-card shadow="always" style="height: 100%; width: 100%">
            <div class="visit">
              <div
                ref="VisitRef"
                :style="{ width: '100%', height: '300px', marginTop: '-22px' }"
                v-loading="visitLoading"
                element-loading-text="加载中..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
              ></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="7" style="padding-left: 6px; padding-right: 6px">
          <el-card shadow="always" style="height: 100%; width: 100%">
            <el-input
              style="width: 153px; position: relative; left: 230px"
              @keyup.enter.native="search"
              placeholder="请输入用户名"
              v-model="searchCount"
              :suffix-icon="Search"
            />
            <div class="table">
              <el-table size="small" :data="tableData" style="width: 100%">
                <el-table-column prop="username" label="我的账户" width="100" />
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="parkstatus"
                  label="车位状态"
                  width="190"
                >
                  <template #default="scope">
                    <span>
                      {{ scope.row.parkstatus === 1 ? '已有车' : '未有车' }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="coststatus"
                  label="缴费状态"
                >
                  <template #default="scope">
                    <span v-if="scope.row.coststatus === 2">未支付</span>
                    <span v-else-if="scope.row.coststatus === 1">已支付</span>
                    <span v-else>暂无</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page">
              <el-pagination
                :page-size="4"
                small="true"
                @current-change="handleCurrentChange"
                v-model:current-page="currentPage"
                layout="prev, pager, next"
                :total="CountTotal"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DocumentCopy, Search, BellFilled, Avatar, Van, Edit, Loading } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import {
  getPost,
  getUser,
  getCost,
  getPark,
  getFeedBack,
  getHouse,
  getParking,
  getCostItem,
  getVisit,
  getCount,
  CountSearch,
} from '@/api/shouye.ts'
import router from '@/router/index'

// 图表加载状态
const pieLoading = ref(true)
const carLoading = ref(true)
const costLoading = ref(true)
const visitLoading = ref(true)

const searchCount = ref('')
const CountTotal = ref(0)
const tableData = ref([])
const userNum = ref(0)
const costNum = ref(0)
const parkNum = ref(0)
const feedbackNum = ref(0)
const scrollContainer = ref(null)
const noticeWrapper = ref(null)
const post = ref([])
const currentIndex = ref(0)
const query = {
  currPage: 0,
  pageNum: 100,
}
const query1 = {
  currPage: 0,
  pageNum: 4,
}
const query2 = {
  currPage: 0,
  pageNum: 4,
}
const query3 = {
  currPage: 0,
  pageNum: 4,
}
const query4 = {
  currPage: 0,
  pageNum: 4,
}
const query5 = {
  type: 2,
  currPage: 0,
  pageNum: 4,
}
const currentPage = ref(query5.currPage + 1)

let animationInterval: number | null = null
let animationDuration = 1000 // 动画持续时间
let pauseDuration = 3000 // 停顿时间
let itemHeight = 58 // 每个公告项的高度

// 计算显示的公告列表（包含克隆项）
const displayPosts = computed(() => {
  if (post.value.length <= 1) return post.value

  // 克隆第一行数据到末尾，实现无缝滚动
  return [...post.value, { ...post.value[0] }]
})

const getPostData = () => {
  getPost(query).then((res) => {
    post.value = res.data
    // 数据加载完成后初始化滚动
    nextTick(() => {
      initScrollAnimation()
    })
  })
}
const getUserData = () => {
  getUser(query1).then((res) => {
    userNum.value = res.total
  })
}
const getCostData = () => {
  getCost(query2).then((res) => {
    costNum.value = res.total
  })
}
const getParkData = () => {
  getPark(query3).then((res) => {
    parkNum.value = res.total
  })
}
const getFeedBackData = () => {
  getFeedBack(query4).then((res) => {
    feedbackNum.value = res.total
  })
}

// 公告滚动动画
const initScrollAnimation = () => {
  if (!scrollContainer.value || !noticeWrapper.value || post.value.length <= 1) {
    return
  }

  // 设置容器高度
  scrollContainer.value.style.height = `${itemHeight}px`
  scrollContainer.value.style.setProperty('--animation-duration', `${animationDuration}ms`)

  // 设置初始位置
  updatePosition()

  // 开始动画循环
  startScrollAnimation()
}

const startScrollAnimation = () => {
  if (post.value.length <= 1) {
    return
  }

  // 清除之前的定时器（如果存在）
  if (animationInterval) {
    clearInterval(animationInterval)
  }

  animationInterval = setInterval(() => {
    // 在定时器回调中再次检查DOM是否存在
    if (scrollContainer.value && noticeWrapper.value) {
      scrollToNext()
    }
  }, pauseDuration + animationDuration)
}

const scrollToNext = () => {
  if (!scrollContainer.value || !noticeWrapper.value || post.value.length <= 1) {
    return
  }

  // 添加动画类
  noticeWrapper.value.classList.add('scrolling')

  // 计算下一条公告的索引
  const nextIndex = currentIndex.value + 1

  // 更新位置
  currentIndex.value = nextIndex
  updatePosition()

  // 当滚动到克隆项时，重置回第一条
  if (nextIndex === post.value.length) {
    setTimeout(() => {
      if (noticeWrapper.value) {
        noticeWrapper.value.classList.remove('scrolling')
        // 使用nextTick确保DOM更新完成后再重置位置
        nextTick(() => {
          currentIndex.value = 0
          updatePosition()
        })
      }
    }, animationDuration)
  } else {
    // 正常滚动结束后移除动画类
    setTimeout(() => {
      if (noticeWrapper.value) {
        noticeWrapper.value.classList.remove('scrolling')
      }
    }, animationDuration)
  }
}

const updatePosition = () => {
  if (!noticeWrapper.value) return

  // 设置容器位置
  noticeWrapper.value.style.transition = noticeWrapper.value.classList.contains('scrolling')
    ? `transform var(--animation-duration) ease-in-out`
    : 'none'

  noticeWrapper.value.style.transform = `translateY(-${currentIndex.value * itemHeight}px)`
}

// 跳转公告详情
const goNotice = () => {
  router.push({
    name:'notice'
  })
}

// 小区数据
const houseData = ref<{ value: number; name: string }[]>([])

// 获取小区数据
const getHouseData = () => {
  const obj = {
    unitname: '',
    currPage: 1,
    pageNum: 4,
  }

  const unitNames = ['A', 'B', 'C', 'D']
  pieLoading.value = true // 开始加载

  // 使用Promise.all处理多个异步请求
  Promise.all(
    unitNames.map((unitName) =>
      getHouse({ ...obj, unitname: unitName }).then((res) => ({
        res,
        unitName,
      }))
    )
  )
    .then((responses) => {
      houseData.value = responses.map(({ res, unitName }) => ({
        value: res.total,
        name: `${unitName}区`,
      }))
      // 数据加载完成后初始化图表
      initHouseChart()
    })
    .catch((error) => {
      console.error('获取小区数据失败', error)
      pieLoading.value = false // 加载失败也关闭loading
    })
}
const PiechartInstance = ref<echarts.ECharts | null>(null)
const PieRef = ref(null)

// 初始化图表
const initHouseChart = () => {
  if (!PieRef.value) return

  // 销毁旧实例（如果存在）
  if (PiechartInstance.value) {
    PiechartInstance.value.dispose()
  }

  // 创建新的ECharts实例
  PiechartInstance.value = echarts.init(PieRef.value)

  if (PiechartInstance.value && houseData.value.length > 0) {
    PiechartInstance.value.setOption({
      toolbox: {
        show: true,
        top: 0,
        right: 0,
        feature: {
          dataView: {
            readOnly: false,
            show: true,
          },
          restore: {
            show: true,
          },
          saveAsImage: {
            show: true,
            title: '保存为图片',
          },
        },
      },
      title: {
        text: '小区分布统计',
        subtext: '',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '小区分布',
          type: 'pie',
          radius: '50%',
          data: houseData.value,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    })

    // 监听窗口大小变化，重新渲染图表
    window.addEventListener('resize', () => {
      if (PiechartInstance.value) {
        PiechartInstance.value.resize()
      }
    })
    
    pieLoading.value = false // 加载完成
  }
}

// 监听数据变化，重新渲染图表
watch(
  () => houseData.value,
  () => {
    if (houseData.value.length > 0) {
      initHouseChart()
    }
  },
  { deep: true }
)

// 车位数据
const parkData = ref<
  {
    name: string
    total: number
    allocated: number
    paid: number
  }[]
>([])

// 获取车位数据
const getParkingData = () => {
  const obj = {
    currPage: 0,
    pageNum: 4,
  }

  const parkAreas = ['A', 'B', 'C', 'D'] // 车位区域
  carLoading.value = true // 开始加载

  // 处理每个区域的车位数据
  const processAreaData = async (area: string) => {
    try {
      // 1. 获取总车位数
      const totalRes = await getParking({ ...obj, parkname: area })
      const total = totalRes.total

      // 2. 获取已分配量 (parkstatus: 1)
      const allocatedRes = await getParking({ ...obj, parkname: area, parkstatus: 1 })
      const allocated = allocatedRes.total

      // 3. 获取已缴费量 (orderstatus: 1) 遍历所有缴费项目筛选orderstatus=1的
      const paidRes = await getParking({ ...obj, parkname: area })
      const paid = paidRes.data.filter((item) => item.orderstatus === 1).length

      return {
        name: `${area}区车位数`,
        total,
        allocated,
        paid,
      }
    } catch (error) {
      console.error(`获取${area}区车位数据失败`, error)
      return {
        name: `${area}区车位数`,
        total: 0,
        allocated: 0,
        paid: 0,
      }
    }
  }

  // 使用Promise.all处理所有区域的数据
  Promise.all(parkAreas.map(processAreaData))
    .then((areasData) => {
      parkData.value = areasData
      // 数据加载完成后初始化图表
      initParkingChart()
    })
    .catch((error) => {
      console.error('获取车位数据失败', error)
      carLoading.value = false // 加载失败也关闭loading
    })
}

const CarchartInstance = ref<echarts.ECharts | null>(null)
const CarRef = ref(null)


// 初始化车位柱状图
const initParkingChart = () => {
  if (!CarRef.value) return

  // 销毁旧实例（如果存在）
  if (CarchartInstance.value) {
    CarchartInstance.value.dispose()
  }

  // 创建新的ECharts实例
  CarchartInstance.value = echarts.init(CarRef.value)

  if (CarchartInstance.value && parkData.value.length > 0) {
    // 整理数据
    const datasetSource = [
      ['区域', '车位数', '已分配量', '已缴费'],
      ...parkData.value.map((area) => [area.name, area.total, area.allocated, area.paid]),
    ]

    CarchartInstance.value.setOption({
      toolbox: {
        show: true,
        top: -4,
        right: 0,
        feature: {
          restore: {
            show: true,
            title: '还原'
          }
        }
      },
      title: {
        text: '',
        left: 'center',
      },
      grid: {
        top: '80',
      },
      legend: {
        data: ['车位数', '已分配量', '已缴费'],
        left: '40%',
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
        name: '',
      },
      dataset: {
        source: datasetSource,
      },
      // 定义三个柱状图
      series: [
        {
          type: 'bar',
          name: '车位数',
          encode: {
            x: '区域',
            y: '车位数'
          },
          label: {
            show: true,
            position: 'top',
          },
        },
        {
          type: 'bar',
          name: '已分配量',
          encode: {
            x: '区域',
            y: '已分配量'
          },
          label: {
            show: true,
            position: 'top',
          },
        },
        {
          type: 'bar',
          name: '已缴费',
          encode: {
            x: '区域',
            y: '已缴费'
          },
          label: {
            show: true,
            position: 'top',
          },
        },
      ],
    })


    // 监听窗口大小变化，重新渲染图表
    window.addEventListener('resize', () => {
      if (CarchartInstance.value) {
        CarchartInstance.value.resize()
      }
    })
    
    carLoading.value = false // 加载完成
  }
}

// 监听数据变化，重新渲染图表
watch(
  () => parkData.value,
  () => {
    if (parkData.value.length > 0) {
      initParkingChart()
    }
  },
  { deep: true }
)

// 计费数据
const costData = ref<{ name: string; total: number }[]>([])

// 计费项目配置
const costItemsConfig = [
  { c_id: 7, name: '电费单' },
  { c_id: 8, name: '水费固定月单' },
  { c_id: 9, name: '水费按量单' },
  { c_id: 10, name: '天然气单' },
  { c_id: 11, name: '物业费单' },
  { c_id: 12, name: '宽带费单' },
]

// 获取计费项目数据
const getCostItemData = () => {
  const obj = {
    currPage: 0,
    pageNum: 4,
  }
  costLoading.value = true // 开始加载

  // 处理每个计费项目的数据
  const fetchCostItem = async (item: { c_id: number; name: string }) => {
    try {
      const res = await getCostItem({ ...obj, c_id: item.c_id })
      return {
        name: item.name,
        total: res.total,
      }
    } catch (error) {
      console.error(`获取${item.name}数据失败`, error)
      return {
        name: item.name,
        total: 0,
      }
    }
  }

  // 使用Promise.all并行获取所有计费项目数据
  Promise.all(costItemsConfig.map(fetchCostItem))
    .then((areasData) => {
      costData.value = areasData
      // 数据加载完成后初始化图表
      initCostChart()
    })
    .catch((error) => {
      console.error('获取计费项目数据失败', error)
      costLoading.value = false // 加载失败也关闭loading
    })
}

const CostchartInstance = ref<echarts.ECharts | null>(null)
const CostRef = ref(null)

// 初始化计费雷达图
const initCostChart = () => {
  if (!CostRef.value) return

  // 销毁旧实例（如果存在）
  if (CostchartInstance.value) {
    CostchartInstance.value.dispose()
  }

  // 创建新的ECharts实例
  CostchartInstance.value = echarts.init(CostRef.value)

  if (CostchartInstance.value && costData.value.length > 0) {
    // 提取数据值
    const dataValues = costData.value.map((item) => item.total)

    // 定义雷达图指标
    const indicator = costData.value.map((item) => ({
      name: item.name,
      max: 10,
    }))

    CostchartInstance.value.setOption({
      title: {
        text: '缴费项目订单',
        subtext: '',
        top: '0',
        right: '0',
        textStyle: {
          color: '#333',
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return `${params.name}: ${params.value}项`
        },
      },
      legend: {
        //图例形状
        left: '0',
        top: '0',
        textStyle: {
          color: '#333',
          fontSize: 12,
        },
        data: ['计费项目'],
        itemStyle: {
          color: '#58B7FC', // 图例标记颜色（与数据线条颜色一致）
          borderColor: 'transparent', // 边框颜色
          borderWidth: 0, // 边框宽度
        },
      },
      radar: {
        center: ['50%', '55%'],
        radius: '70%',
        indicator: indicator,
        splitNumber: 4,
        // 雷达图底盘颜色配置（网格区域）
        splitArea: {
          areaStyle: {
            color: [
              'rgba(255,238,243)', // 第一层网格颜色
              'rgba(255,238,243)', // 第二层网格颜色
            ],
          },
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(209,208,208)',
            width: 1,
          },
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(209,208,208)',
            width: 1,
          },
        },
        name: {
          textStyle: {
            color: '#909090',
            fontSize: 12,
          },
        },
      },
      series: [
        {
          type: 'radar',
          name: '计费项目',
          data: [
            {
              value: dataValues,
              name: '项目数量',
              areaStyle: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    { offset: 0, color: 'rgba(88,183,252, 0.3)' },
                    { offset: 1, color: 'rgba(88,183,252, 0.6)' },
                  ],
                  false
                ),
                shadowBlur: 10,
                shadowColor: 'rgba(76, 189, 255, 0.5)',
              },
              lineStyle: {
                color: '#4CB3FF',
                width: 2,
              },
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: {
                color: '#4CB3FF',
              },
              label: {
                show: true,
                position: 'outside',
                formatter: '{c}',
                color: '#58B7FC',
                fontSize: 10,
              },
            },
          ],
        },
      ],
    })

    // 监听窗口大小变化，重新渲染图表
    window.addEventListener('resize', () => {
      if (CostchartInstance.value) {
        CostchartInstance.value.resize()
      }
    })
    
    costLoading.value = false // 加载完成
  }
}

// 监听数据变化，重新渲染图表
watch(
  () => costData.value,
  () => {
    if (costData.value.length > 0) {
      initCostChart()
    }
  },
  { deep: true }
)

// 访问数据
const visitData = ref<any[]>([])
const visitCountByDay = ref<number[]>([])

// 获取访问数据
const getVisitData = () => {
  visitLoading.value = true // 开始加载
  
  getVisit()
    .then((res: any) => {
      visitData.value = res
      processVisitData()

      // 添加延迟确保数据准备好
      setTimeout(() => {
        initVisitChart()
      }, 200) // 200ms 延迟
    })
    .catch((error) => {
      console.error('获取访问数据失败', error)
      visitCountByDay.value = [
        0,
        ...Array.from({ length: 31 }, () => Math.floor(Math.random() * 80) + 20),
      ]
      setTimeout(() => {
        initVisitChart()
      }, 200)
    })
}

// 处理访问数据，按日期统计访问量
const processVisitData = () => {
  // 初始化32天的访问量为0（00-31）
  const visitCount = new Array(32).fill(0)

  // 按日期统计访问量
  visitData.value.forEach((item) => {
    if (item.createtime) {
      // 提取日期部分 "2025-07-02T03:23:27.000Z" -> "02"
      const datePart = item.createtime.split('-')[2].split('T')[0]
      const day = parseInt(datePart, 10)

      // 转换为00-31格式（1号对应00，31号对应31）
      if (day >= 1 && day <= 31) {
        visitCount[day]++ // 直接使用day作为索引（1-31对应数组索引1-31）
      }
    }
  })

  // 确保00位置为0
  visitCount[0] = 0

  visitCountByDay.value = visitCount
  //   console.log('各天访问量统计(00-31):', visitCountByDay.value)
}

const VisitchartInstance = ref<echarts.ECharts | null>(null)
const VisitRef = ref(null)

// 初始化访问图表
const initVisitChart = () => {
  if (!VisitRef.value || visitCountByDay.value.length === 0) return

  // 销毁旧实例（如果存在）
  if (VisitchartInstance.value) {
    VisitchartInstance.value.dispose()
  }

  // 创建新的ECharts实例
  VisitchartInstance.value = echarts.init(VisitRef.value)

  if (VisitchartInstance.value && visitCountByDay.value.length > 0) {
    // 生成X轴日期标签（00-31）
    const days = Array.from({ length: 32 }, (_, i) => i.toString().padStart(2, '0'))

    // 基础配置
    const baseOption = {
      grid: {
        top: '70px',
        left: '40px',
        right: '40px',
        bottom: '30px',
      },
      title: {
        text: '当月用户访问情况',
        top: '20px',
        left: 'left',
        textStyle: {
          color: '#333',
          fontSize: 16,
        },
      },
      legend: {
        data: ['用户访问量'],
        top: '20px',
        left: 'center',
        textStyle: {
          color: '#333',
          fontSize: 12,
        },
        itemStyle: {
          color: '#fff',
          borderColor: '#19D4AE',
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          let result = `<div style="font-size:14px;color:#333;">${params[0].name}</div>`
          params.forEach((item) => {
            result += `<div style="margin-top:5px;">
                   <span style="display:inline-block;width:10px;height:10px;border-radius:5px;background-color:${item.color}"></span>
                   ${item.seriesName}: ${item.value}
                 </div>`
          })
          return result
        },
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: '#eee',
        borderWidth: 1,
        textStyle: {
          color: '#333',
        },
      },
      xAxis: {
        type: 'category',
        data: days,
        axisLabel: {
          margin: 10,
          formatter: '{value}',
        },
      },
      yAxis: {
        type: 'value',
        name: '',
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(220, 220, 220, 0.9)',
            width: 1,
            type: 'solid',
          },
        },
        axisTick: {
          show: false,
        },
      },
      // 关键修改：将系列配置移到基础配置中
      series: [
        {
          name: '用户访问量',
          type: 'line', // 默认显示折线图
          data: visitCountByDay.value,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#fff',
            borderColor: '#19D4AE',
            borderWidth: 2,
          },
          lineStyle: {
            color: '#19D4AE',
            width: 3,
            type: 'smooth',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                { offset: 0, color: 'rgba(0, 0, 0, 0)' },
                { offset: 1, color: 'rgba(0, 0, 0, 0)' },
              ],
              false
            ),
          },
          label: {
            show: false,
          },
          emphasis: {
            focus: 'series',
            scale: true,
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(25, 212, 174, 0.5)',
            },
          },
        },
      ],
      toolbox: {
        show: true,
        top: 10,
        right: 20,
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true, title: '保存图片' },
          magicType: {
            show: true,
            type: ['line', 'bar'],
            title: {
              line: '折线图',
              bar: '柱状图',
            },
            // 关键修改：简化magicType配置
            option: {
              line: {
                series: [
                  {
                    type: 'line',
                    smooth: true,
                  },
                ],
              },
              bar: {
                series: [
                  {
                    type: 'bar',
                    label: {
                      show: false, // 取消柱状图顶部数值显示
                    },
                  },
                ],
              },
            },
          },
          dataZoom: {
            show: true,
          },
        },
      },
    }

    // 设置选项
    VisitchartInstance.value.setOption(baseOption)

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      VisitchartInstance.value?.resize()
    })
    
    visitLoading.value = false // 加载完成
  }
}

// 获取账户数据
const getCountData = () => {
  getCount(query5)
    .then((res) => {
      // console.log(res.total)
      CountTotal.value = res.total
      tableData.value = res.data
    })
    .catch((err) => {
      console.error(err)
    })
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  query5.currPage = val - 1
  getCountData()
}

const token = localStorage.getItem('token')
const search = () => {
  const obj = {
    inputText: searchCount.value,
    value: 2,
    currPage: 0,
    pageNum: 4,
    token: token,
  }
  CountSearch(obj).then((res) => {
    currentPage.value = 1
    query5.currPage = 0
    tableData.value = res.data
    CountTotal.value = res.total
  })
}

onMounted(() => {
  // 获取数据
  getPostData()
  getUserData()
  getCostData()
  getParkData()
  getFeedBackData()
  getHouseData()
  getParkingData()
  getCostItemData()
  getVisitData()
  getCountData()

  // 添加DOM加载完成后的检查
  nextTick(() => {
    if (!scrollContainer.value || !noticeWrapper.value) {
      console.warn('公告容器DOM元素未找到，滚动动画将不会初始化')
    }
  })
})

onUnmounted(() => {
  // 清理定时器和图表实例
  if (animationInterval) {
    clearInterval(animationInterval)
    animationInterval = null
  }

  // 清理所有ECharts实例
  const chartInstances = [
    PiechartInstance.value,
    CarchartInstance.value,
    CostchartInstance.value,
    VisitchartInstance.value,
  ]

  chartInstances.forEach((instance) => {
    if (instance) {
      instance.dispose()
    }
  })

  // 移除所有resize事件监听器
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped lang="scss">
.shouye {
  margin: 0;
  padding: 0;
}
// 公告
.gonggao {
  width: 100%;
  margin-top: 58px;
  background-color: #fff;
  height: 58px;
  display: flex;
  align-items: center;
}
.newnotice {
  float: left;
  font-weight: 700;
  color: #4995f7;
  padding: 18px;
  font-size: 14px;
}
.notice {
  overflow: hidden;
  display: flex;
  flex: 1;
  height: 58px;
}
.donghua {
  position: relative;
  overflow: hidden;
  width: 100%;
}
.notice-wrapper {
  position: relative;
}
.notice-item {
  font-size: 14px;
  font-weight: 700;
  display: flex;
  margin-left: 70px;
  width: 100%;
  height: 58px;
  line-height: 58px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.hidden-cont {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

// 滚动动画类
.scrolling {
  transition: transform var(--animation-duration) ease-in-out;
}

// 四卡片
.cards {
  width: 98.6%;
  height: 130px;
  margin-top: 10px;
  margin-left: 1%;
  display: flex;
  justify-content: space-between;
}
.card-cont {
  width: 72%;
  height: 100%;
  display: flex;
  margin: auto;
  align-items: center;
  justify-content: space-between;
}
.card-icon {
  width: 50px;
  height: 40px;
}
.card-text {
  width: 100px;
  height: 40px;
  margin-right: -3%;
}
.card-text .userNum {
  margin-top: -3px;
  font-size: 32px;
  font-weight: 700;
}
.card-text .dic {
  font-size: 14px;
  margin-top: 8px;
}

// 图表
.echarts {
  width: 98.6%;
  height: 290px;
  margin-top: 10px;
  margin-left: 1%;
  display: flex;
  justify-content: space-between;
}
.pie {
  width: 100%;
  height: 100%;
}

// bottom
.bottom {
  margin-top: 90px;
  width: 98.6%;
  margin-left: 1%;
  display: flex;
  justify-content: space-between;
}
.visit {
  width: 100%;
  height: 100%;
}

// 表格
.table {
  margin-top: 10px;
}
:deep(.el-table--small .el-table__cell) {
  padding: 10px 0 !important;
}
.page {
  display: flex;
  justify-content: center;
}
</style>