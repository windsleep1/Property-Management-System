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
        <el-tab-pane label="我的信息" name="myMsg">
          <el-form label-width="110px" :model="form" style="margin-left: 20px">
            <el-row style="margin-top: 20px; margin-bottom: 20px">
              <el-col :span="12">
                <el-form-item label="*用户账号:">
                  <el-input readonly v-model="form.username"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="*用户名称:">
                  <el-input readonly v-model="form.nickname"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-bottom: 20px">
              <el-col :span="12">
                <el-form-item label="*性别:">
                  <el-input disabled v-model="form.sex"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="*类型:">
                  <el-input disabled v-model="form.type"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-bottom: 20px">
              <el-col :span="12">
                <el-form-item label="联系电话:">
                  <el-input readonly v-model="form.phone"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱:">
                  <el-input readonly v-model="form.email"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-bottom: 20px">
              <el-col :span="12">
                <el-form-item label="生效时间:">
                  <el-input :prefix-icon="Calendar" disabled v-model="form.createtime"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="详细住址:">
                  <el-input disabled v-model="form.homeaddress"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-bottom: 20px">
              <el-col :span="12">
                <el-form-item label="我的车位:">
                  <el-input readonly v-model="form.parkname"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="计费状态:">
                  <el-input readonly v-model="form.coststatus"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="我的描述:">
              <el-input type="textarea" readonly v-model="form.note"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <h4 style="margin-top: 20px; margin-left: 10px">头像信息/更换</h4>
      <el-card style="margin-top: 10px" shadow="always">
        <el-image
          :src="form.icon"
          style="width: 260px; height: 240px; margin-top: 10px; margin-left: 20px"
          show-progress
          :preview-src-list="srcList"
          fit="cover"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :initial-index="4"
        />
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="handleUpload"
          style="
            margin-left:20px;
            
            border-radius: 6px !important;
            cursor: pointer !important;
            position: relative !important;
            overflow: hidden !important;
            transition: var(--el-transition-duration-fast) !important;
            display: inline-block !important;
          "
        >
          <img v-if="tempAvatarUrl" :src="tempAvatarUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Calendar } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { getMy, uploadAvatar } from '@/api/owner/myMsg'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { UploadRequestOptions } from 'element-plus/es/components/upload/src/upload'
import request from '@/utils/request' 


const activeName = ref('myMsg')

const form = ref({
  username: '',
  nickname: '',
  sex: '',
  type: '',
  phone: '',
  email: '',
  createtime: '',
  homeaddress: '',
  parkname: '',
  coststatus: '',
  note: '',
  icon: '',
})

const tempAvatarUrl = ref('') // 临时头像URL
const srcList = ref([''])

// 自定义上传方法
const handleUpload = async (options: UploadRequestOptions) => {
  const token = localStorage.getItem('token') || ''
  const file = options.file
  
  try {
    // 生成临时预览
    tempAvatarUrl.value = URL.createObjectURL(file)
    
    // 调用上传接口
    await uploadAvatar(token, file)
    
    // 上传成功提示
    ElMessage.success('头像更换成功！重新登录即可查看')
    
    
  } catch (error) {
    ElMessage.error('头像上传失败')
    console.error('上传错误:', error)
    // 清除临时预览
    tempAvatarUrl.value = ''
  }
}

// 上传前的校验
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const allowedTypes = ['image/jpeg']
  const isImage = allowedTypes.includes(rawFile.type)
  const isLt2M = rawFile.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传图像只能是 JPG 格式!')
    return false
  }
  
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  
  return true
}


const getMYmsg = () => {
  getMy({
    id: '',
    token: localStorage.getItem('token'),
  }).then((res) => {
    form.value.username = res[0].username
    form.value.nickname = res[0].nickname
    form.value.sex = res[0].sex
    if (res[0].type == 2) {
      form.value.type = '普通用户'
    } else if (res[0].type == 1) {
      form.value.type = '管理员'
    }
    form.value.phone = res[0].phone
    form.value.email = res[0].email
    form.value.createtime = formatDateTime(res[0].createtime).split(' ')[0]
    form.value.homeaddress = res[0].homeaddress
    form.value.parkname = res[0].parkname
    if (res[0].coststatus == 1) {
      form.value.coststatus = '已缴费'
    } else if (res[0].coststatus == 2) {
      form.value.coststatus = '未缴费'
    } else {
      form.value.coststatus = ''
    }
    form.value.note = res[0].note
    form.value.icon = 'http://community.byesame.com/file/' + res[0].icon
    srcList.value = ['http://community.byesame.com/file/' + res[0].icon]
  })
}

// 处理时间(加八小时)
const formatDateTime = (dateTime: string) => {
  if (!dateTime) return '暂无'

  // 创建UTC日期对象
  const date = new Date(dateTime)

  // 直接获取UTC时间的各个部分，手动加8小时
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  // 手动加8小时（处理跨天情况）
  let hours = date.getUTCHours() + 8
  let displayDay = day

  // 处理加8小时后跨天的情况
  if (hours >= 24) {
    hours -= 24
    // 计算下一天的日期（简化处理，不考虑月份和年份变化）
    displayDay = String(parseInt(day) + 1).padStart(2, '0')
  }

  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')

  return `${year}-${month}-${displayDay} ${String(hours).padStart(2, '0')}:${minutes}:${seconds}`
}

const handleClick = () => {
  console.log(activeName.value)
}

onMounted(() => {
  getMYmsg()
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


// 修复上传组件悬停效果
:deep(.avatar-uploader) .el-upload {
  border: 1px dashed var(--el-border-color) !important;
  border-radius: 6px !important;
  cursor: pointer !important;
  position: relative !important;
  overflow: hidden !important;
  transition: border-color 0.3s !important;
  display: inline-block !important;
  width: 178px;
  height: 178px;

  &:hover {
    border-color: var(--el-color-primary) !important;
  }
}

:deep(.el-icon.avatar-uploader-icon) {
  font-size: 28px !important;
  color: #8c939d !important;
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

:deep(.avatar-uploader) .avatar {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
</style>