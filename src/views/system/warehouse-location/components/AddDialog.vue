<template>
  <ep-dialog :title="dialogType == 'create'?'新增四号定位':'修改四号定位'" iconTitle="form" v-model="visible" width="800px" top="5vh" append-to-body>
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="120px"> 
        <div class="form-left flex1">
          <el-form-item label="用料地区：" prop="plantId">
            <el-select v-model="formData.plantId" placeholder="请选择用料地区" clearable @change="plantChange" :disabled="dialogType != 'create'">
              <el-option v-for="item in plantList" :key="item.id" :label="item.plantName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库：" prop="whId">
            <el-select v-model="formData.whId" placeholder="请选择仓库" clearable @change="whChange" :disabled="dialogType != 'create'">
              <el-option v-for="item in warehouseDictList" :key="item.id" :label="item.whName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库分区：" prop="partitionId">
            <el-select v-model="formData.partitionId" placeholder="请选择仓库分区" clearable @change="partitionChange" :disabled="dialogType != 'create'">
              <el-option v-for="item in partitionList" :key="item.id" :label="item.partitionName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" " prop="frameName" label-width="53px" style="margin-right: 7px;">
            <el-select v-model="formData.frameName" style="width: 60px;" placeholder="">
              <el-option v-for="item in frameNameArr" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="frame">
            <el-input v-model="formData.frame" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="层：" prop="layer">
            <el-input v-model="formData.layer" placeholder="请输入层" />
          </el-form-item>
          <el-form-item label="位：" prop="position">
            <el-input v-model="formData.position" placeholder="请输入位" />
          </el-form-item>
          <!-- 货位类型字段注释保留：需求去掉新增页货位类型，如需恢复放开本段及下方formData/rules注释即可
          <el-form-item label="货位类型：" prop="positionType">
            <el-select v-model="formData.positionType" placeholder="请选择货位类型" clearable>
              <el-option v-for="item in positionTypeArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          -->
          <el-form-item label="是否有效：" prop="status">
            <el-select v-model="formData.status" placeholder="请选择是否有效" clearable>
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="comments" label="备注：" style="width: 672px;">
            <el-input type="textarea" v-limit-text-len="200" v-model="formData.comments" placeholder="请输入备注" />
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
import { statusArr, positionTypeArr } from '@/utils/dictionary'
import { locationCreateModify } from '@/api/warehouse/warehouseLocation'
import { plantDictListAll } from '@/api/warehouse/plantDict'
import { warehouseDictListAll } from '@/api/warehouse/warehouseDict'
import { partitionListAll } from '@/api/warehouse/partition'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const dialogType = ref('create')

const data = reactive({
  formData: {
    plantId: '',
    plantCode: '',
    whId: '',
    whCode: '',
    partitionId: '',
    partitionCode: '',
    frameName: '架',
    frame: '',
    layer: '',
    position: '',
    // positionType: '', // 货位类型注释保留，恢复时放开
    status: '1',
    comments: ''
  },
  rules: {
    plantId: [{ required: true, message: '请选择用料地区', trigger: ['blur', 'change']}],
    whId: [{ required: true, message: '请选择仓库', trigger: ['blur', 'change']}],
    partitionId: [{ required: true, message: '请选择仓库分区', trigger: ['blur', 'change']}],
    frameName: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
    frame: [{ required: true, message: '请输入', trigger: 'blur' }],
    layer: [{ required: true, message: '请输入层', trigger: 'blur' }],
    position: [{ required: true, message: '请输入位', trigger: 'blur' }],
    // positionType: [{ required: true, message: '请选择货位类型', trigger: ['blur', 'change'] }], // 货位类型注释保留，恢复时放开
    status: [{ required: true, message: '请选择是否有效', trigger: ['blur', 'change']}],
  },
  plantList: [],
  warehouseDictList: [],
  partitionList: [],
  frameNameArr: ['架', '柜'],
})

const { formData, rules, plantList, warehouseDictList, partitionList, frameNameArr } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

const getPlantDictListAll = () => {
  plantDictListAll().then( ({data}) => {
    plantList.value = data
  })
}

const getWarehouseDictListAll = (plantId) => {
  warehouseDictListAll({plantId}).then( ({data}) => {
    warehouseDictList.value = data
  })
}

const getPartitionListAll = (whId) => {
  partitionListAll({whId}).then( ({data}) => {
    partitionList.value = data || []
  })
}

// 显示弹框
function show(type, row = {}) {
  visible.value = true
  dialogType.value = type
  warehouseDictList.value = []
  partitionList.value = []
  getPlantDictListAll()
	proxy.$nextTick(async () => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    formData.value = Object.assign({}, formData.value, row)
    if(formData.value.plantId){
      await getWarehouseDictListAll(formData.value.plantId)
    }
    if(formData.value.whId){
      await getPartitionListAll(formData.value.whId)
    }
  })

}

const plantChange = () => {
  formData.value.whId = ''
  formData.value.partitionId = ''
  warehouseDictList.value = []
  partitionList.value = []
  const plantObj = plantList.value.find(item => item.id === formData.value.plantId)
  formData.value.plantCode = plantObj?.plantCode
  if(formData.value.plantId){
    getWarehouseDictListAll(formData.value.plantId)
  }
}

const whChange = () => {
  formData.value.partitionId = ''
  partitionList.value = []
  const whObj = warehouseDictList.value.find(item => item.id === formData.value.whId)
  formData.value.whCode = whObj?.whCode
  if(formData.value.whId){
    getPartitionListAll(formData.value.whId)
  }
}

const partitionChange = () => {
  const partitionObj = partitionList.value.find(item => item.id === formData.value.partitionId)
  formData.value.partitionCode = partitionObj?.partitionCode
}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      proxy.$modal.loading()
      locationCreateModify(formData.value, dialogType.value).then( ({message}) => {
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