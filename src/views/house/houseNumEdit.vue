<template>
  <div class="content">
    <div class="top">
      <div>
        <span @click="goback" style="color: #409eff; cursor: pointer">返回</span>
      </div>
      <div style="margin-top: 20px">
        <p style="font-size: 20px; font-weight: 600; margin-bottom: 20px">
          <span style="font-size: 30px; font-weight: 900; color: #20a0ff">|</span>
          房号信息
        </p>
        <div class="form">
          <el-form ref="numRef" :rules="numrules" :model="numForm" label-width="180">
            <el-row>
              <el-col :span="12">
                <el-form-item label="单元名称:" prop="unitname">
                  <el-input clearable v-model="numForm.unitname" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="幢号:" prop="buildnum">
                  <el-input clearable v-model="numForm.buildnum" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="楼层号:" prop="storeynum">
                  <el-input clearable v-model="numForm.storeynum" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="房号:" prop="homenum">
                  <el-input clearable v-model="numForm.homenum" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="住客姓名:" prop="homename">
                  <el-input clearable v-model="numForm.homename" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态:" prop="homestatus">
                  <el-select v-model="numForm.homestatus" placeholder="请选择">
                    <el-option label="已入住" :value="1"></el-option>
                    <el-option label="未入住" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="房屋信息" prop="homemessage">
              <el-input type="textarea" :rows="6" v-model="numForm.homemessage" />
            </el-form-item>
            <el-form-item label="家庭成员" prop="homesuggestion">
              <el-input type="textarea" :rows="6" v-model="numForm.homesuggestion" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div style="margin-top: 20px">
        <p style="font-size: 20px; font-weight: 600; margin-bottom: 20px">
          <span style="font-size: 30px; font-weight: 900; color: #20a0ff">|</span>
          智能设备
        </p>
        <div class="form">
          <el-form ref="smartRef" :rules="Smartrules" :model="SmartForm" label-width="180">
            <el-row>
              <el-col :span="12">
                <el-form-item label="洗衣机数量:" prop="washnum">
                  <el-input clearable v-model="SmartForm.washnum" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="WI-FI名称:" prop="wifiname">
                  <el-input clearable v-model="SmartForm.wifiname" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="空调数量:" prop="airnum">
                  <el-input clearable v-model="SmartForm.airnum" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="智能设备状态:" prop="smartstatus">
                  <el-select v-model="SmartForm.smartstatus" placeholder="请选择">
                    <el-option label="完好" :value="1"></el-option>
                    <el-option label="待维修" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div style="margin-top: 20px">
        <p style="font-size: 20px; font-weight: 600; margin-bottom: 20px">
          <span style="font-size: 30px; font-weight: 900; color: #20a0ff">|</span>
          家居设备
        </p>
        <div class="form">
          <el-form ref="homeRef" :rules="Homerules" :model="HomeForm" label-width="180">
            <el-row>
              <el-col :span="12">
                <el-form-item label="书桌数量:" prop="homedesk">
                  <el-input clearable v-model="HomeForm.homedesk" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="椅子数量:" prop="homechair">
                  <el-input clearable v-model="HomeForm.homechair" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="衣橱数量:" prop="homeclothes">
                  <el-input clearable v-model="HomeForm.homeclothes" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="家居设备状态:" prop="familystatus">
                  <el-select v-model="HomeForm.familystatus" placeholder="请选择">
                    <el-option label="完好" :value="1"></el-option>
                    <el-option label="待维修" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div style="display: flex; justify-content: right; margin-top: 20px">
        <el-button @click="submit(numRef, smartRef, homeRef)" type="success">保存</el-button>
        <el-button @click="goback" type="primary">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router/index'
import type { FormInstance, FormRules } from 'element-plus'
import { getDetail,editHouse } from '@/api/house/houseNum'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()

const numForm = ref({
  unitname: '',
  buildnum: '',
  storeynum: '',
  homenum: '',
  homename: '',
  homestatus: null,
  homemessage: '',
  homesuggestion: '',
})

const numRef = ref<FormInstance>()

const numrules = ref<FormRules>({
  unitname: [{ required: true, message: '请输入单元名称', trigger: 'blur' }],
  buildnum: [{ required: true, message: '请输入幢号', trigger: 'blur' }],
  storeynum: [{ required: true, message: '请输入楼层号', trigger: 'blur' }],
  homenum: [{ required: true, message: '请输入房号', trigger: 'blur' }],
  homename: [{ required: true, message: '请输入住客姓名', trigger: 'blur' }],
  homestatus: [{ required: true, message: '请选择状态', trigger: 'change' }],
  homemessage: [{ required: true, message: '请输入房屋信息', trigger: 'blur' }],
  homesuggestion: [{ required: true, message: '请输入家庭成员', trigger: 'blur' }],
})

const SmartForm = ref({
  washnum: '',
  wifiname: '',
  airnum: '',
  smartstatus: null,
})

const Smartrules = ref<FormRules>({
  washnum: [{ required: true, message: '请输入洗衣机数量', trigger: 'blur' }],
  wifiname: [{ required: true, message: '请输入WI-FI名称', trigger: 'blur' }],
  airnum: [{ required: true, message: '请输入空调数量', trigger: 'blur' }],
  smartstatus: [{ required: true, message: '请选择智能设备状态', trigger: 'change' }],
})

const smartRef = ref<FormInstance>()

const HomeForm = ref({
  homedesk: '',
  homechair: '',
  homeclothes: '',
  familystatus: null,
})

const Homerules = ref<FormRules>({
  homedesk: [{ required: true, message: '请输入书桌数量', trigger: 'blur' }],
  homechair: [{ required: true, message: '请输入椅子数量', trigger: 'blur' }],
  homeclothes: [{ required: true, message: '请输入衣橱数量', trigger: 'blur' }],
  familystatus: [{ required: true, message: '请选择家居设备状态', trigger: 'change' }],
})

const homeRef = ref<FormInstance>()

const getData = () => {
  getDetail({
    id: route.query.editId,
    token: localStorage.getItem('token'),
  })
    .then((res) => {
      numForm.value.unitname = res[0].unitname
      numForm.value.buildnum = res[0].buildnum
      numForm.value.storeynum = res[0].storeynum
      numForm.value.homenum = res[0].homenum
      numForm.value.homename = res[0].homename
      numForm.value.homestatus = res[0].homestatus
      numForm.value.homemessage = res[0].homemessage
      numForm.value.homesuggestion = res[0].homesuggestion
      SmartForm.value.washnum = res[0].washnum
      SmartForm.value.wifiname = res[0].wifiname
      SmartForm.value.airnum = res[0].airnum
      SmartForm.value.smartstatus = res[0].smartstatus
      HomeForm.value.homedesk = res[0].homedesk
      HomeForm.value.homechair = res[0].homechair
      HomeForm.value.homeclothes = res[0].homeclothes
      HomeForm.value.familystatus = res[0].familystatus
    })
    .catch((err) => {
      ElMessage.error('获取信息失败,请重试')
    })
}

const submit = async (
  numRef: FormInstance | undefined,
  smartRef: FormInstance | undefined,
  homeRef: FormInstance | undefined
) => {
  if (!numRef || !smartRef || !homeRef) return
  await numRef.validate((valid, fields) => {
    if (valid) {
        smartRef.validate((valid, fields) => {
            if (valid) {
                homeRef.validate((valid, fields) => {
                    if (valid) {
                        ElMessageBox.confirm('确定保存信息吗？','提示',{
                            cancelButtonText: '取消',
                            confirmButtonText: '确定',
                        }).then(() => {
                            editHouse({
                                id: route.query.editId,
                                h_id:route.query.editId,
                                ...numForm.value,
                                ...SmartForm.value,
                                ...HomeForm.value,
                                token: localStorage.getItem('token'),
                            }).then(res => {
                                ElMessage.success('更新信息成功')
                                goback()
                            }).catch(err => {
                                ElMessage.error(err)
                            })
                        }).catch(() => {

                        })
                    } else {
                        console.log('error submit!', fields)
                    }
                })
            } else {
                console.log('error submit!', fields)
            }
        })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const goback = () => {
  router.push({
    name: 'houseNum',
  })
}

onMounted(() => {
  getData()
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