<template>
  <ep-dialog :title="dialogType == 'create'?'新增供应地区用料地区对应关系':'修改供应地区用料地区对应关系'" v-model="visible" width="700px" top="5vh" append-to-body>
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="100px"> 
        <div class="form-left flex1">
          <el-form-item prop="useUnitName" label="用料单位：">
            <el-input v-model.trim="formData.useUnitName" disabled placeholder="请输入用料单位" />
          </el-form-item>
          <el-form-item prop="usePlantName" label="用料地区：">
            <el-input v-model.trim="formData.usePlantName" disabled placeholder="请输入用料地区" />
          </el-form-item>
          <el-form-item label="供应单位：" prop="supplyUnitCode">
            <el-select v-model="formData.supplyUnitCode" placeholder="请选择供应单位" clearable @change="supplyUnitChange">
              <el-option v-for="item in deptAssignList" :key="item.unitCode" :label="item.unitName" :value="item.unitCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应地区：" prop="supplyPlantId">
            <el-select v-model="formData.supplyPlantId" placeholder="请选择供应地区" clearable @change="supplySupplyPlant">
              <el-option v-for="item in plantList" :key="item.id" :label="item.plantName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应区域：" prop="supplyAreaId">
            <el-select v-model="formData.supplyAreaId" placeholder="请选择供应区域" clearable>
              <el-option v-for="item in supplyAreaListData" :key="item.id" :label="item.areaName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="管理权限：" prop="manageLevel">
            <el-select v-model="formData.manageLevel" placeholder="请选择管理权限" clearable>
              <el-option v-for="item in manageLevelArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否有效：" prop="status">
            <el-select v-model="formData.status" placeholder="请选择是否有效" clearable>
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
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
import { statusArr, manageLevelArr } from '@/utils/dictionary'
import { useplantSupplyareaCreateModify } from '@/api/warehouse/useplantSupplyarea'
import { unitGetUnitList } from "@/api/system/unit"
import { plantDictListAll } from '@/api/warehouse/plantDict'
import { supplyAreaListAll } from '@/api/warehouse/supplyArea'

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
    useUnitCode: '',
    useUnitName: '',
    usePlantName: '',
    usePlantCode: '',
    usePlantId: '',
    supplyUnitCode: '',
    supplyPlantId: '',
    supplyPlantCode: '',
    supplyAreaId: '',
    supplyAreaCode: '',
    manageLevel: '',
    status: '1'
  },
  rules: {
    supplyUnitCode: [{ required: true, message: '请选择供应单位', trigger: ['blur', 'change']}],
    supplyPlantId: [{ required: true, message: '请选择供应地区', trigger: ['blur', 'change']}],
    supplyAreaId: [{ required: true, message: '请选择供应区域', trigger: ['blur', 'change']}],
    manageLevel: [{ required: true, message: '请选择管理权限', trigger: ['blur', 'change']}],
    status: [{ required: true, message: '请选择是否有效', trigger: ['blur', 'change']}],
  },
  deptAssignList: [],
  plantList: [],
  supplyAreaListData: []
})

const { formData, rules, deptAssignList, plantList, supplyAreaListData } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

const getUnitGetUnitList = () => {
  unitGetUnitList({sysCode: '08'}).then(({ data }) => {
    deptAssignList.value = data
  })
}

const getPlantDictListAll = (unitCode = '') => {
  plantDictListAll({unitCode}).then( ({data}) => {
    plantList.value = data
  })
}

const getSupplyAreaListAll = (plantId) => {
  supplyAreaListAll({plantId}).then( ({data}) => {
    supplyAreaListData.value = data
  })
}



// 显示弹框
function show(type, row = {}) {
  visible.value = true
  dialogType.value = type
  getUnitGetUnitList()
  getPlantDictListAll(row.supplyUnitCode || '')
  getSupplyAreaListAll(row.supplyPlantId || '')
	proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    formData.value = Object.assign({},formData.value, props.plantData || {}, row)
	})
}

const supplyUnitChange = () => {
  formData.value.supplyPlantId = ''
  formData.value.supplyAreaId = ''
  getPlantDictListAll(formData.value.supplyUnitCode)
}

const supplySupplyPlant = () => {
  formData.value.supplyAreaId = ''
  getSupplyAreaListAll(formData.value.supplyPlantId)
}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      const plantFilter = plantList.value.filter(item => item.id == formData.value.supplyPlantId)
      const supplyAreaFilter = supplyAreaListData.value.filter(item => item.id == formData.value.supplyAreaId)
      supplyAreaListData.value
      formData.value.supplyPlantCode = plantFilter[0]?.plantCode
      formData.value.supplyAreaCode = supplyAreaFilter[0]?.areaCode
      proxy.$modal.loading()
      useplantSupplyareaCreateModify(formData.value, dialogType.value).then( ({message}) => {
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