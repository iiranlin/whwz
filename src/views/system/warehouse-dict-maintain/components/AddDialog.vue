<template>
  <ep-dialog :title="dialogType == 'create'?'新增仓库':'修改仓库'" iconTitle="form" v-model="visible" width="800px" top="5vh" append-to-body>
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="142px"> 
        <div class="form-left flex1">
          <el-form-item label="用料地区：" prop="plantName">
            <el-input v-model.trim="formData.plantName" disabled  />
          </el-form-item>
          <el-form-item prop="whCode" label="仓库编码：">
            <el-input v-model.trim="formData.whCode" disabled placeholder="自动生成" />
          </el-form-item>
          <el-form-item prop="whName" label="仓库名称：">
            <el-input v-model.trim="formData.whName" placeholder="请输入仓库名称"/>
            <el-tooltip content="命名建议：组织机构名称+仓库级别+2位顺位号+“号”+仓库场所类型，如**车间 1 号库房、**工区 12 号料场" effect="light">
              <el-icon class="ep-icon-question-filled"><QuestionFilled/></el-icon>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="仓库级别：" prop="whLevel" label-width="123px">
            <el-select v-model="formData.whLevel" placeholder="请选择仓库级别" clearable>
              <el-option v-for="item in whLevelArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库场所类型：" prop="venueType">
            <el-select v-model="formData.venueType" placeholder="请选择仓库场所类型" clearable>
              <el-option v-for="item in venueTypeArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="whAddress" label="仓库地址：">
            <el-input v-model.trim="formData.whAddress" placeholder="请输入仓库地址" />
          </el-form-item>
          <el-form-item prop="whSize" label="仓库面积(平方米)：">
            <el-input v-model.trim="formData.whSize" v-number-input.float="4" placeholder="请输入仓库面积" />
          </el-form-item>
          <el-form-item prop="whDirector" label="仓库负责人：">
            <el-input v-model.trim="formData.whDirector" placeholder="请输入仓库负责人" />
          </el-form-item>
          <el-form-item prop="direcotrPhone" label="负责人电话：">
            <el-input v-model.trim="formData.direcotrPhone" placeholder="请输入负责人电话" />
          </el-form-item>
          <el-form-item prop="longitude" label="仓库定位-经度：">
            <span>东经</span>
            <el-input style="width: 50px;" v-model.trim="longitudeObj.longitudeA" v-number-input /><span>°</span>
            <el-input style="width: 50px;" v-model.trim="longitudeObj.longitudeB" v-number-input /><span>′</span>
            <el-input style="width: 50px;" v-model.trim="longitudeObj.longitudeC" v-number-input /><span>″</span>
          </el-form-item>
          <el-form-item prop="latitude" label="仓库定位-纬度：">
            <span>北纬</span>
            <el-input style="width: 50px;" v-model="latitudeObj.latitudeA" v-number-input /><span>°</span>
            <el-input style="width: 50px;" v-model="latitudeObj.latitudeB" v-number-input /><span>′</span>
            <el-input style="width: 50px;" v-model="latitudeObj.latitudeC" v-number-input /><span>″</span>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;{{ dialogType === 'create'?'保存':'确定' }}</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { whLevelArr, venueTypeArr } from '@/utils/dictionary'
import { warehouseDictCreateModify } from '@/api/warehouse/warehouseDict'
const { proxy } = getCurrentInstance()

// 接收参数并指定类型（可选）
const props = defineProps({
  plantData: {
    type: Object,
    default: null
  }
})

const visible = ref(false)
const dialogType = ref('create')

const data = reactive({
  formData: {
    plantId: '',
    plantCode: '',
    plantName: '',
    whCode: '',
    whName: '',
    whLevel: '',
    venueType: '',
    whAddress: '',
    whSize: '',
    whDirector: '',
    direcotrPhone: '',
    longitude: '',
    latitude: '',
  },
  rules: {
    whName: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
    whLevel: [{ required: true, message: '请选择仓库级别', trigger: ['blur', 'change']}],
    venueType: [{ required: true, message: '请选择仓库场所类型', trigger: ['blur', 'change']}],
    whAddress: [{ required: true, message: '请输入仓库地址', trigger: 'blur' }],
  },
  latitudeObj: {latitudeA: '', latitudeB: '', latitudeC: ''},
  longitudeObj: {longitudeA: '', longitudeB: '', longitudeC: ''}
})

const { formData, rules, latitudeObj, longitudeObj } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

// 显示弹框
function show(type, row = {}) {
  visible.value = true
  dialogType.value = type
  latitudeObj.value = {latitudeA: '', latitudeB: '', latitudeC: ''}
  longitudeObj.value = {longitudeA: '', longitudeB: '', longitudeC: ''}
	proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    formData.value = Object.assign({}, props.plantData || {}, row)
    if(row.latitude){
      let latitudeDataA = row.latitude.split('°')
      let latitudeDataB = latitudeDataA[1]?.split('′')
      let latitudeDataC = latitudeDataB[1]?.split('″')
      latitudeObj.value.latitudeA = latitudeDataA[0]
      latitudeObj.value.latitudeB = latitudeDataB[0]
      latitudeObj.value.latitudeC = latitudeDataC[0]
    }
    if(row.longitude){
      let longitudeDataA = row.longitude.split('°')
      let longitudeDataB = longitudeDataA[1]?.split('′')
      let longitudeDataC = longitudeDataB[1]?.split('″')
      longitudeObj.value.longitudeA = longitudeDataA[0]
      longitudeObj.value.longitudeB = longitudeDataB[0]
      longitudeObj.value.longitudeC = longitudeDataC[0]
    }
  })

}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      formData.value.latitude = `${latitudeObj.value.latitudeA?`${latitudeObj.value.latitudeA}°`:''}${latitudeObj.value.latitudeB?`${latitudeObj.value.latitudeB}′`:''}${latitudeObj.value.latitudeC?`${latitudeObj.value.latitudeC}″`:''}`
      formData.value.longitude = `${longitudeObj.value.longitudeA?`${longitudeObj.value.longitudeA}°`:''}${longitudeObj.value.longitudeB?`${longitudeObj.value.longitudeB}′`:''}${longitudeObj.value.longitudeC?`${longitudeObj.value.longitudeC}″`:''}`
      proxy.$modal.loading()
      let type = ''
      if(dialogType.value === 'create'){
        type = 'addWarehouseDict'
      }else{
        type = 'updateWarehouseDict'
      }
      warehouseDictCreateModify(formData.value, type).then( ({message}) => {
          proxy.$modal.msgSuccess(message)
          visible.value = false
          emit('createSuccess')
      }).finally( () => {
        proxy.$modal.closeLoading()
      })
    }
  })
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
.ep-icon-question-filled{
  margin-left: 5px;
  color: #ffaa3c;
}
</style>