<template>
  <ep-dialog :title="dialogType === 'exchange'?'换货':'退货'" iconTitle="form" v-model="visible" width="600px" top="5vh" append-to-body>
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="120px"> 
        <div class="form-left flex1">
          <el-form-item prop="reason" :label="`${dialogType === 'exchange'?'换货':'退货'}原因：`" style="width: 500px;">
            <el-input type="textarea" v-limit-text-len="200" v-model="formData.reason" placeholder="请输入" />
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
import { exchangeIsExchange, exchangeIsReturn } from '@/api/warehouse/exchange'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const dialogType = ref('')
const pdbIdData = ref('')

const data = reactive({
  formData: {
    reason: ''
  },
  rules: {
    reason: [{ required: true, message: '请输入', trigger: 'blur' }],
  }
})

const { formData, rules } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

// 显示弹框
function show(type, {pdbId = '', arrivalNum = 0, acceptanceNum = 0}) {
  visible.value = true
  dialogType.value = type
  pdbIdData.value = pdbId
	proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    formData.value.reason = `本批次到货${arrivalNum}个，验收通过${acceptanceNum}个，${type === 'exchange'?'换货':'退货'}${Number(arrivalNum) - Number(acceptanceNum)}个`
  })

}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      const url = dialogType.value === 'exchange'?exchangeIsExchange:exchangeIsReturn
      proxy.$modal.loading()
      url({...formData.value, pdbId: pdbIdData.value}).then( ({message}) => {
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
.ep-dialog{
  .sso-front-table-container{
    height: auto !important;
    min-height: 200px !important;
  }
}
</style>