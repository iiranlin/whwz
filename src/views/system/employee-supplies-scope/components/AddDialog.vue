<template>
  <ep-dialog :title="dialogType == 'create'?'新增职工物资管理范围':'修改职工物资管理范围'" iconTitle="form" v-model="visible" width="800px" top="5vh" append-to-body>
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="150px"> 
        <div class="form-left flex1">
          <el-form-item label="职工姓名：" prop="userName">
            <el-input v-model.trim="formData.userName" disabled  />
          </el-form-item>
          <el-form-item label="是否启用：" prop="status">
            <el-select v-model="formData.status" placeholder="请选择是否启用" clearable >
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用料地区：" prop="plantId">
            <el-select v-model="formData.plantId" placeholder="请选择用料地区" clearable @change="plantChange" :disabled="dialogType != 'create'">
              <el-option v-for="item in plantList" :key="item.id" :label="item.plantName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库：" prop="whId">
            <el-select v-model="formData.whId" placeholder="请选择仓库" @change="whChange" clearable :disabled="dialogType != 'create'">
              <el-option v-for="item in warehouseDictList" :key="item.id" :label="item.whName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库分区：" :prop="dialogType == 'create'?'partitions':'partitionId'">
            <el-select v-if="dialogType == 'create'" v-model="formData.partitions" placeholder="请选择仓库分区" value-key="id" clearable :multiple="dialogType == 'create'" collapse-tags collapse-tags-tooltip>
              <el-option v-for="item in prePartitionList" :key="item.id" :label="item.partitionName" :value="item">
              </el-option>
            </el-select>
            <el-select v-else v-model="formData.partitionId" placeholder="请选择仓库分区" clearable :multiple="dialogType == 'create'" collapse-tags collapse-tags-tooltip :disabled="dialogType != 'create'">
              <el-option v-for="item in prePartitionList" :key="item.id" :label="item.partitionName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="firMatlcode" label="开始物资编码：">
            <el-input v-model.trim="formData.firMatlcode" v-only-alphanumeric placeholder="请输入开始物资编码" />
          </el-form-item>
          <el-form-item prop="endMatlcode" label="结束物资编码：">
            <el-input v-model.trim="formData.endMatlcode" v-only-alphanumeric placeholder="请输入结束物资编码"/>
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
import { userMatlCreateModify } from '@/api/warehouse/userMatl'
import { plantDictListAll } from '@/api/warehouse/plantDict'
import { partitionListAll } from '@/api/warehouse/partition'
import { warehouseDictListAll } from '@/api/warehouse/warehouseDict'
const { proxy } = getCurrentInstance()

// 接收参数并指定类型（可选）
const props = defineProps({
  userData: {
    type: Object,
    default: null
  },
})

const visible = ref(false)
const dialogType = ref('create')

const data = reactive({
  formData: {
    userId: '',
    userCode: '',
    userName: '',
    status: '1',
    plantId: '',
    plantCode: '',
    whId: '',
    whCode: '',
    partitions: [],
    firMatlcode: '',
    endMatlcode: ''
  },
  rules: {
    status: [{ required: true, message: '请选择是否启用', trigger: ['blur', 'change']}],
    plantId: [{ required: true, message: '请选择用料地区', trigger: ['blur', 'change']}],
    whId: [{ required: true, message: '请选择仓库', trigger: ['blur', 'change']}],
    partitions: [{ required: true, message: '请选择仓库分区', trigger: ['blur', 'change']}],
    partitionId: [{ required: true, message: '请选择仓库分区', trigger: ['blur', 'change']}],
    firMatlcode: [{ required: true, message: '请输入开始物资编码', trigger: 'blur' }],
    endMatlcode: [{ required: true, message: '请输入结束物资编码', trigger: 'blur' }],
  },
  plantList: [],
  warehouseDictList: [],
  prePartitionList: []
})

const { formData, rules, plantList, warehouseDictList, prePartitionList } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

const getPlantDictListAll = () => {
  plantDictListAll().then( ({data}) => {
    plantList.value = data || []
  })
}

const getWarehouseDictListAll = (plantId) => {
  warehouseDictListAll({plantId}).then( ({data}) => {
    warehouseDictList.value = data || []
  })
}

const getPartitionListAll = (whId) => {
  partitionListAll({whId}).then( ({data}) => {
    prePartitionList.value = data || []
  })
}

// 显示弹框
function show(type, row = {}) {
  visible.value = true
  dialogType.value = type
  warehouseDictList.value = []
  prePartitionList.value = []
  getPlantDictListAll()
	proxy.$nextTick(async () => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    formData.value = Object.assign({}, formData.value, props.userData || {}, row)
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
  formData.value.partitions = []
  warehouseDictList.value = []
  prePartitionList.value = []
  const plantObj = plantList.value.find(item => item.id === formData.value.plantId)
  formData.value.plantCode = plantObj?.plantCode
  if(formData.value.plantId){
    getWarehouseDictListAll(formData.value.plantId)
  }
}

const whChange = () => {
  formData.value.partitions = []
  prePartitionList.value = []
  const whObj = warehouseDictList.value.find(item => item.id === formData.value.whId)
  formData.value.whCode = whObj.whCode
  if(formData.value.whId){
    getPartitionListAll(formData.value.whId)
  }
}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      proxy.$modal.loading()
      userMatlCreateModify(formData.value, dialogType.value).then( ({message}) => {
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