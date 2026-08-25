<template>
  <ep-dialog title="停用" iconTitle="form" v-model="visible" width="600px" top="5vh" append-to-body>
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="120px"> 
        <div class="form-left flex1">
          <el-form-item label="停用原因：" prop="disableReason">
            <el-select v-model="formData.disableReason" placeholder="请选择" clearable @change="disableReasonChange">
              <el-option v-for="item in disableReasonList" :key="item.code" :label="item.desc" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="formData.disableReason == '12'" prop="reason" label="备注：" style="width: 500px;" :rules="[{ required: formData.disableReason == '12'?true:false, message: '请输入备注', trigger: ['blur', 'change']}]">
            <el-input type="textarea" v-limit-text-len="200" v-model="formData.reason" placeholder="请输入备注" />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;取消</el-button>
        <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;确定</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { gtOrderDisable, gtOrderDisableReason } from '@/api/warehouse/gtOrder'
const { proxy } = getCurrentInstance()

const visible = ref(false)

const data = reactive({
  formData: {
    disableReason: '',
    reason: '',
    dtIds: []
  },
  rules: {
    disableReason: [{ required: true, message: '请选择停用原因', trigger: ['blur', 'change']}]
  },
  disableReasonList: []
})

const { formData, rules, disableReasonList } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

const getOrderDisableReason = () => {
  gtOrderDisableReason().then( ({data}) => {
    disableReasonList.value = data || []
  })
}
// 显示弹框
function show(dtIds = []) {
  visible.value = true
  formData.value.dtIds = dtIds
  getOrderDisableReason()
	proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
  })
}

const disableReasonChange = () => {
  proxy.$refs.elForm.clearValidate('reason')
}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      proxy.$modal.loading()
      gtOrderDisable(formData.value).then( ({message}) => {
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