<template>
  <ep-dialog :title="dialogType == 'create'?'新增仓库分区':'修改仓库分区'" iconTitle="form" v-model="visible" width="810px" top="5vh" append-to-body>
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="100px"> 
        <div class="form-left flex1">
          <el-form-item prop="whName" label="仓库名称：">
            <el-input v-model.trim="formData.whName" disabled/>
          </el-form-item>
          <el-form-item prop="partitionCode" label="仓库分区编号：">
            <el-input v-model.trim="formData.partitionCode" disabled placeholder="自动生成" />
          </el-form-item>
          <el-form-item prop="partitionName" label="仓库分区：">
            <el-input v-model.trim="formData.partitionName" placeholder="仓库名称+库存属性+区"/>
          </el-form-item>
          <el-form-item label="库存属性：" prop="stockattr">
            <el-select v-model="formData.stockattr" placeholder="请选择库存属性" clearable :disabled="dialogType != 'create'">
              <el-option v-for="item in formSelectData.stockattr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应税用途：" prop="taxFlagCode">
            <el-select v-model="formData.taxFlagCode" placeholder="请选择应税用途" clearable @change="taxFlagChange" :disabled="dialogType != 'create'">
              <el-option v-for="item in dictList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-divider />
          <div class="form-wrapper-matl" v-for="(item, index) in formData.matlCodeRangeList" :key="index">
            <el-form-item label="存储物资编码范围：" label-width="150px">
            </el-form-item>
            <el-form-item :prop="`matlCodeRangeList.${index}.firMatlCode`" label="前物资范围：" label-width="100px" :rules="rules.firMatlCode">
              <el-input v-model.trim="item.firMatlCode" v-only-alphanumeric placeholder="请输入" style="width: 100px;" />
            </el-form-item>
            <el-form-item :prop="`matlCodeRangeList.${index}.endMatlCode`" label="后物资范围：" label-width="100px" :rules="rules.endMatlCode">
              <el-input v-model.trim="item.endMatlCode" v-only-alphanumeric placeholder="请输入" style="width: 100px;" />
            </el-form-item>
            <el-form-item label-width="10px" v-if="dialogType === 'create'">
              <el-button type="primary" icon="Plus" circle @click="handleAdd"></el-button>
              <el-button type="danger" icon="Minus" circle @click="handleDelete(index)" v-if="formData.matlCodeRangeList.length > 1"></el-button>
            </el-form-item>
          </div>
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
import { partitionCreateModify } from '@/api/warehouse/partition'
import { useDict } from "@/utils/Dict"
const { proxy } = getCurrentInstance()

// 接收参数并指定类型（可选）
const props = defineProps({
  plantData: {
    type: Object,
    default: null
  },
})

const visible = ref(false)
const dialogType = ref('create')
const formSelectData = ref({stockattr: []})

const data = reactive({
  formData: {
    whCode: '',
    whName: '',
    whId: '',
    partitionCode: '',
    partitionName: '',
    stockattr: '',
    taxFlagCode: '',
    taxFlagName: '',
    matlCodeRangeList: [{firMatlCode: '', endMatlCode: ''}]
  },
  rules: {
    partitionName: [{ required: true, message: '请输入仓库分区', trigger: 'blur' }],
    stockattr: [{ required: true, message: '请选择存货属性', trigger: ['blur', 'change']}],
    taxFlagCode: [{ required: true, message: '请选择应税用途', trigger: ['blur', 'change']}],
    firMatlCode: [{ required: true, message: '请输入前物资范围', trigger: 'blur' }],
    endMatlCode: [{ required: true, message: '请输入后物资范围', trigger: 'blur' }],
  }
})

const { formData, rules } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

const { dictList } = useDict('tax_flag')
const { dictList:stockattr } = useDict('stock_attr')
formSelectData.value.stockattr = stockattr

const taxFlagChange = () => {
  if(formData.value.taxFlagCode){
    const dictListFilter = dictList.value.filter(item => item.code === formData.value.taxFlagCode)
    formData.value.taxFlagName = dictListFilter[0].name
  }else{
    formData.value.taxFlagName = ''
  }
}

// 显示弹框
function show(type, row = {}) {
  visible.value = true
  dialogType.value = type
	proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    formData.value = Object.assign({}, props.plantData || {}, row, {matlCodeRangeList: [{id: row.rangeId || '',firMatlCode: row.firMatlCode || '', endMatlCode: row.endMatlCode || ''}]})
  })

}

const handleAdd = () => {
  formData.value.matlCodeRangeList.push({firMatlCode: '', endMatlCode: ''})
}

const handleDelete = (i) => {
  formData.value.matlCodeRangeList.splice(i, 1)
}

const hasNoDuplicateObjects = (arr) => {
  const seen = new Set()
  for (const obj of arr) {
    const str = JSON.stringify(obj)
    if(seen.has(str)) return false
    seen.add(str)
  }
  return true
}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      let type = 'addWarehousePartition'
      if(dialogType.value === 'modify'){
        type = 'updateWarehousePartition'
      }
      if(!hasNoDuplicateObjects(formData.value.matlCodeRangeList)){
        proxy.$modal.msgWarning('存储物资编码范围不能相同')
        return
      }
      proxy.$modal.loading()
      partitionCreateModify(formData.value, type).then( ({message}) => {
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