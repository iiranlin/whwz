<template>
  <ep-dialog :title="dialogType == 'create'?'新增局外单位':'修改局外单位'" iconTitle="form" v-model="visible" width="800px" top="5vh" append-to-body>
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="150px"> 
        <div class="form-left flex1">
          <el-form-item prop="unitCode" label="单位编号：">
            <el-input v-model.trim="formData.unitCode" placeholder="请输入单位编号" />
          </el-form-item>
          <el-form-item prop="unitName" label="单位名称：">
            <el-input v-model.trim="formData.unitName" placeholder="请输入单位名称"/>
          </el-form-item>
          <el-form-item label="单位类型：" prop="unitType">
            <el-select v-model="formData.unitType" placeholder="请选择单位类型" clearable>
              <el-option v-for="item in unitTypeArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="unitShortName" label="单位简称：">
            <el-input v-model.trim="formData.unitShortName" placeholder="请输入单位简称" />
          </el-form-item>
          <el-form-item prop="mailingAddress" label="通讯地址：">
            <el-input v-model.trim="formData.mailingAddress" placeholder="请输入通讯地址" />
          </el-form-item>
          <el-form-item prop="contact" label="联系人：">
            <el-input v-model.trim="formData.contact" placeholder="请输入联系人" />
          </el-form-item>
          <el-form-item prop="contactPosition" label="联系人职务：">
            <el-input v-model.trim="formData.contactPosition" placeholder="请输入联系人职务" />
          </el-form-item>
          <el-form-item prop="contactPhone" label="联系人电话：">
            <el-input v-model.trim="formData.contactPhone" placeholder="请输入联系人电话" />
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
import { unitTypeArr } from '@/utils/dictionary'
import { addUpdateOutSideUnit } from '@/api/warehouse/warehouseDict'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const dialogType = ref('create')

const data = reactive({
  formData: {
    unitCode: '',
    unitName: '',
    unitType: '',
    unitShortName: '',
    mailingAddress: '',
    contact: '',
    contactPosition: '',
    contactPhone: ''
  },
  rules: {
    unitCode: [{ required: true, message: '请输入单位编号', trigger: 'blur' }],
    unitName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
    unitType: [{ required: true, message: '请选择单位类型', trigger: ['blur', 'change']}],
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
    formData.value = {...row}
  })

}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      let type = 'addOutSideUnit'
      if(dialogType.value === 'modify'){
        type = 'updateOutSideUnit'
      }
      proxy.$modal.loading()
      addUpdateOutSideUnit(formData.value, type).then( ({message}) => {
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