<template>
  <div class="s-canvas" @click="refreshCode">
    <canvas ref="canvasRef" :width="contentWidth" :height="contentHeight"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  identifyCode: {
    type: String,
    default: '1234'
  },
  fontSizeMin: {
    type: Number,
    default: 25
  },
  fontSizeMax: {
    type: Number,
    default: 35
  },
  backgroundColorMin: {
    type: Number,
    default: 180
  },
  backgroundColorMax: {
    type: Number,
    default: 240
  },
  colorMin: {
    type: Number,
    default: 0
  },
  colorMax: {
    type: Number,
    default: 160
  },
  lineColorMin: {
    type: Number,
    default: 40
  },
  lineColorMax: {
    type: Number,
    default: 180
  },
  dotColorMin: {
    type: Number,
    default: 0
  },
  dotColorMax: {
    type: Number,
    default: 255
  },
  contentWidth: {
    type: Number,
    default: 120
  },
  contentHeight: {
    type: Number,
    default: 40
  }
})

const canvasRef = ref(null)

// 生成一个随机数
const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

// 生成一个随机的颜色
const randomColor = (min, max) => {
  min = Math.max(0, Math.min(255, min))
  max = Math.max(0, Math.min(255, max))
  if (min > max) [min, max] = [max, min]
  
  let r = randomNum(min, max)
  let g = randomNum(min, max)
  let b = randomNum(min, max)
  return `rgb(${r},${g},${b})`
}

// 验证字符是否可显示
const isValidChar = (char) => {
  if (!char) return false
  
  const charCode = char.charCodeAt(0)
  // 过滤不可见字符
  return charCode > 32 && charCode < 127
}

// 绘制干扰线
const drawLine = (ctx) => {
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = randomColor(props.lineColorMin, props.lineColorMax)
    ctx.beginPath()
    ctx.moveTo(randomNum(0, props.contentWidth), randomNum(0, props.contentHeight))
    ctx.lineTo(randomNum(0, props.contentWidth), randomNum(0, props.contentHeight))
    ctx.stroke()
  }
}

// 在画布上显示数据
const drawText = (ctx, txt, i) => {
  ctx.fillStyle = randomColor(props.colorMin, props.colorMax)
  
  // 确保字体大小在合理范围内
  const fontSize = randomNum(props.fontSizeMin, props.fontSizeMax)
  ctx.font = `${fontSize}px Arial, SimHei, sans-serif`
  
  // 计算位置
  const x = (i + 1) * (props.contentWidth / (props.identifyCode.length + 1))
  const y = randomNum(fontSize, props.contentHeight - 5)
  
  // 设置旋转角度
  const deg = randomNum(-30, 30)
  
  // 应用变换
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((deg * Math.PI) / 180)
  
  // 绘制文本
  ctx.fillText(txt, 0, 0)
  
  // 恢复变换
  ctx.restore()
}

// 绘制干扰点
const drawDot = (ctx) => {
  for (let i = 0; i < 80; i++) {
    ctx.fillStyle = randomColor(props.dotColorMin, props.dotColorMax)
    ctx.beginPath()
    ctx.arc(randomNum(0, props.contentWidth), randomNum(0, props.contentHeight), 1, 0, 2 * Math.PI)
    ctx.fill()
  }
}

// 画图
const drawPic = () => {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return
  
  // 清空画布
  ctx.clearRect(0, 0, props.contentWidth, props.contentHeight)
  
  ctx.textBaseline = 'bottom'
  
  // 绘制背景
  ctx.fillStyle = randomColor(props.backgroundColorMin, props.backgroundColorMax)
  ctx.fillRect(0, 0, props.contentWidth, props.contentHeight)
  
  // 验证并绘制有效字符
  const validChars = props.identifyCode
    .split('')
    .filter(char => isValidChar(char))
  
  // 绘制文字
  for (let i = 0; i < validChars.length; i++) {
    drawText(ctx, validChars[i], i)
  }
  
  drawLine(ctx)
  drawDot(ctx)
}

// 刷新验证码
const refreshCode = () => {
  drawPic()
}

// 初始化画布
const initCanvas = () => {
  nextTick(() => {
    if (canvasRef.value) {
      drawPic()
    }
  })
}

// 组件挂载
onMounted(() => {
  initCanvas()
})

// 监听
watch(
  () => props.identifyCode,
  (newVal) => {
    if (typeof newVal === 'string' && newVal.trim()) {
      initCanvas()
    }
  }
)
</script>

<style scoped lang="scss">
.s-canvas {
  cursor: pointer;
  display: inline-block;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  
  canvas {
    display: block;
  }
}
</style>  