<template>
  <ep-dialog :title="dialogType == 'create'?'新增仓库':'修改仓库'" iconTitle="form" v-model="visible" width="800px" top="5vh" append-to-body>
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="150px"> 
        <div class="form-left flex1">
          <el-form-item label="用料地区：" prop="plantName">
            <el-input v-model.trim="formData.plantName" disabled  />
          </el-form-item>
          <el-form-item prop="whCode" label="仓库编码：">
            <el-input v-model.trim="formData.whCode" disabled placeholder="组织机构编码+CK+0001" />
          </el-form-item>
          <el-form-item prop="whName" label="仓库名称：">
            <el-input v-model.trim="formData.whName" placeholder="请输入仓库名称"/>
          </el-form-item>
          <el-form-item label="是否一级库：" prop="isOneLevel">
            <el-select v-model="formData.isOneLevel" placeholder="请选择是否一级库" clearable :disabled="dialogType != 'create'" @change="isOneLevelChange">
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应税用途：" :prop="formData.isOneLevel == '1'?'':'taxFlagCode'">
            <el-select v-model="formData.taxFlagCode" placeholder="请选择应税用途" :disabled="formData.isOneLevel == '1' || dialogType != 'create'" clearable @change="taxFlagChange">
              <el-option v-for="item in dictList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否实际成本计价法：" prop="isCostAccount">
            <el-select v-model="formData.isCostAccount" placeholder="请选择是否实际成本计价法" clearable disabled>
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用：" prop="status">
            <el-select v-model="formData.status" placeholder="请选择是否启用" clearable>
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否车间库：" prop="isWorkshop">
            <el-select v-model="formData.isWorkshop" placeholder="请选择是否车间库" clearable>
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上级库位：" prop="parentId">
            <!-- <el-select v-model="formData.parentId" placeholder="请选择上级库位" clearable>
              <el-option v-for="item in parentArr" :key="item.id" :label="item.whName" :value="item.id">
              </el-option>
            </el-select> -->
            <el-tree-select v-model="formData.parentId" :data="parentArr" :props="{children: 'children', label: 'whName'}" node-key="id" check-strictly :render-after-expand="false"
              :disabled="formData.isOneLevel == '1'" filterable clearable/>
          </el-form-item>
          <el-form-item label="存货属性：" :prop="formData.isOneLevel == '1'?'':'stockattr'">
            <el-select v-model="formData.stockattr" placeholder="请选择存货属性" clearable :disabled="formData.isOneLevel == '1' || dialogType != 'create'">
              <el-option v-for="item in formSelectData['stockattr']" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="sLatitude" label="维度：">
            <span>北纬</span>
            <el-input style="width: 50px;" v-model="sLatitudeObj.sLatitudeA" :disabled="formData.isOneLevel == '0' || dialogType != 'create'" /><span>°</span>
            <el-input style="width: 50px;" v-model="sLatitudeObj.sLatitudeB" :disabled="formData.isOneLevel == '0' || dialogType != 'create'" /><span>′</span>
            <el-input style="width: 50px;" v-model="sLatitudeObj.sLatitudeC" :disabled="formData.isOneLevel == '0' || dialogType != 'create'" /><span>″</span>
          </el-form-item>
          <el-form-item prop="sLongitude" label="经度：">
            <span>东经</span>
            <el-input style="width: 50px;" v-model.trim="sLongitudeObj.sLongitudeA" :disabled="formData.isOneLevel == '0' || dialogType != 'create'" /><span>°</span>
            <el-input style="width: 50px;" v-model.trim="sLongitudeObj.sLongitudeB" :disabled="formData.isOneLevel == '0' || dialogType != 'create'" /><span>′</span>
            <el-input style="width: 50px;" v-model.trim="sLongitudeObj.sLongitudeC" :disabled="formData.isOneLevel == '0' || dialogType != 'create'" /><span>″</span>
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
import { statusArr } from '@/utils/dictionary'
import { warehouseDictCreateModify, warehouseDictTree } from '@/api/warehouse/warehouseDict'
import { useDict } from "@/utils/Dict"
const { proxy } = getCurrentInstance()

// 接收参数并指定类型（可选）
const props = defineProps({
  plantData: {
    type: Object,
    default: null
  },
  formSelectData: {
    type: Object,
    default: null
  },
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
    isOneLevel: '',
    taxFlagCode: '',
    taxFlagName: '',
    isCostAccount: '1',
    isWorkshop: '',
    parentId: '',
    stockattr: '',
    status: '1',
    sLongitude: '',
    sLatitude: ''
  },
  rules: {
    whName: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
    isOneLevel: [{ required: true, message: '请选择是否一级库', trigger: ['blur', 'change']}],
    taxFlagCode: [{ required: true, message: '请选择应税用途', trigger: ['blur', 'change']}],
    isCostAccount: [{ required: true, message: '请选择是否实际成本计价法', trigger: ['blur', 'change']}],
    status: [{ required: true, message: '请选择是否启用', trigger: ['blur', 'change']}],
    isWorkshop: [{ required: true, message: '请选择是否车间库', trigger: ['blur', 'change']}],
    stockattr: [{ required: true, message: '请选择存货属性', trigger: ['blur', 'change']}],
  },
  sLatitudeObj: {sLatitudeA: '', sLatitudeB: '', sLatitudeC: ''},
  sLongitudeObj: {sLongitudeA: '', sLongitudeB: '', sLongitudeC: ''},
  parentArr: []
})

const { formData, rules, sLatitudeObj, sLongitudeObj, parentArr } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

const { dictList } = useDict('tax_flag')

const taxFlagChange = () => {
  if(formData.value.taxFlagCode){
    const dictListFilter = dictList.value.filter(item => item.code === formData.value.taxFlagCode)
    formData.value.taxFlagName = dictListFilter[0].name
  }else{
    formData.value.taxFlagName = ''
  }
}

const getWarehouseDictTree = (plantId) => {
  warehouseDictTree({plantId}).then( ({data}) => {
    parentArr.value = data
  })
}

// 显示弹框
function show(type, row = {}) {
  visible.value = true
  dialogType.value = type
  getWarehouseDictTree(row.plantId || props.plantData.plantId || '')
	proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    formData.value = Object.assign({}, formData.value, props.plantData || {}, row)
  })

}

const isOneLevelChange = () => {
  if(formData.value.isOneLevel == '1'){
    formData.value.taxFlagCode = ''
    formData.value.parentId = ''
    formData.value.stockattr = ''
    return
  }
  if(formData.value.isOneLevel == '0'){
    sLatitudeObj.value = {
      sLatitudeA: '',
      sLatitudeB: '',
      sLatitudeC: ''
    }
    sLongitudeObj.value = {
      sLongitudeA: '',
      sLongitudeB: '',
      sLongitudeC: ''
    }
  }
}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      formData.value.sLatitude = `${sLatitudeObj.value.sLatitudeA?`${sLatitudeObj.value.sLatitudeA}°`:''}${sLatitudeObj.value.sLatitudeB?`${sLatitudeObj.value.sLatitudeB}′`:''}${sLatitudeObj.value.sLatitudeC?`${sLatitudeObj.value.sLatitudeC}″`:''}`
      formData.value.sLongitude = `${sLongitudeObj.value.sLongitudeA?`${sLongitudeObj.value.sLongitudeA}°`:''}${sLongitudeObj.value.sLongitudeB?`${sLongitudeObj.value.sLongitudeB}′`:''}${sLongitudeObj.value.sLongitudeC?`${sLongitudeObj.value.sLongitudeC}″`:''}`
      proxy.$modal.loading()
      warehouseDictCreateModify(formData.value, dialogType.value).then( ({message}) => {
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
</style>