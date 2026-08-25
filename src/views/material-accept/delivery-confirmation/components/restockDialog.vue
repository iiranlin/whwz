<template>
  <ep-dialog title="填写原因" iconTitle="form" v-model="visible" width="800px" top="5vh" append-to-body>
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="120px">
        <div class="form-left flex1">
          <el-form-item prop="reason" label="补货原因：" style="width: 672px;">
            <el-input type="textarea" v-limit-text-len="200" v-model="formData.reason" placeholder="请输入补货原因" />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;取消</el-button>
        <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon
            icon-class="determine" />&nbsp;确定</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { restockAlert } from '@/api/warehouse/purchaseOrder'
const { proxy } = getCurrentInstance()

const visible = ref(false)

const dataIds = ref([])

const reasonValidator = (rule, value, callback) => {
  if (/\S/.test(value)) {
    callback()
  } else {
    callback('补货原因不能为空！')
  }
}

const data = reactive({
  formData: {
    reason: ''
  },
  rules: {
    reason: [{ required: true, validator: reasonValidator, trigger: 'blur' }],
  },
})

const { formData, rules } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['restockSuccess']);

// 显示弹框
function show(row = {}) {
  visible.value = true
  dataIds.value = [row.pdbId]
  proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    formData.value.reason = `本批次发货${row.deliverNum}个，到货${row.arrivalNum}个，补货${row.deliverNum - row.arrivalNum}个`
  })
}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      proxy.$modal.loading()
      restockAlert({ ...formData.value, pdbIds: dataIds.value }).then(({ message }) => {
        proxy.$modal.msgSuccess(message)
        visible.value = false
        emit('restockSuccess')
      }).finally(() => {
        proxy.$modal.closeLoading()
      })
    }
  })
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped></style>