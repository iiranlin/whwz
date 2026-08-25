<template>
  <ep-dialog :title="dialogType == 'create'?'新增供应区域':'修改供应区域'" v-model="visible" width="700px" top="5vh" append-to-body>
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="100px"> 
        <div class="form-left flex1">
          <el-form-item prop="unitName" label="单位：">
            <el-input v-model.trim="formData.unitName" disabled placeholder="请输入单位" />
          </el-form-item>
          <el-form-item prop="plantName" label="供应地区：">
            <el-input v-model.trim="formData.plantName" disabled placeholder="请输入供应地区" />
          </el-form-item>
          <el-form-item prop="areaCode" label="区域编码：">
            <el-input v-model.trim="formData.areaCode" :disabled="dialogType != 'create'" placeholder="请输入区域编码" />
          </el-form-item>
          <el-form-item prop="areaName" label="区域名称：">
            <el-input v-model.trim="formData.areaName" placeholder="请输入区域名称" />
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
import { statusArr } from '@/utils/dictionary'
import { supplyAreaCreateModify } from '@/api/warehouse/supplyArea'

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
    unitCode: '',
    unitName: '',
    plantName: '',
    plantId: '',
    areaCode: '',
    areaName: '',
    status: '1'
  },
  rules: {
    areaCode: [{ required: true, message: '请输入区域编码', trigger: 'blur'}],
    areaName: [{ required: true, message: '请输入区域名称', trigger: 'blur'}],
    status: [{ required: true, message: '请选择是否有效', trigger: ['blur', 'change']}],
  },
})

const { formData, rules } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

// 显示弹框
function show(type, row = {}) {
  visible.value = true
  dialogType.value = type
	proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    formData.value = Object.assign({},formData.value, props.plantData || {}, row)
	})
}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      proxy.$modal.loading()
      supplyAreaCreateModify(formData.value, dialogType.value).then( ({message}) => {
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