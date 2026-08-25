<template>
  <ep-dialog title="补录发货批次" iconTitle="form" v-model="visible" width="600px" top="5vh" append-to-body>
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="120px"> 
        <div class="form-left flex1">
          <el-form-item prop="arrivalNum" label="到货数量：" style="width: 500px;">
            <span>{{ formData.arrivalNum }}</span>
          </el-form-item>
          <el-form-item prop="acceptanceNum" label="已验收数量：" style="width: 500px;">
            <span>{{ formData.acceptanceNum }}</span>
          </el-form-item>
          <el-form-item prop="batchNo" label="发货批次号：" style="width: 500px;">
            <span>{{ formData.batchNo }}</span>
          </el-form-item>
          <el-form-item prop="replenishNum" label="补货数量：" style="width: 500px;">
            <span>{{ formData.replenishNum }}</span>
          </el-form-item>
          <el-form-item prop="remark" label="备注：" style="width: 500px;">
            <el-input type="textarea" v-limit-text-len="200" v-model="formData.remark" placeholder="请输入备注" />
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
import { exchangeReplenishBatch } from '@/api/warehouse/exchange'
const { proxy } = getCurrentInstance()

const visible = ref(false)

const data = reactive({
  formData: {
    arrivalNum: '',
    acceptanceNum: '',
    batchNo: '',
    replenishNum: '',
    pdbId: '',
    remark: ''
  },
  rules: {
  }
})

const { formData, rules } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

// 显示弹框
function show(row = {}) {
  visible.value = true
	proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    formData.value = {
      ...row,
      replenishNum: row.arrivalNum - row.acceptanceNum || 0,
      remark: ''
    }
  })

}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      proxy.$modal.loading()
      exchangeReplenishBatch(formData.value).then( ({message}) => {
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