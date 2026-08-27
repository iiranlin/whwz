<!-- 审批弹窗（自采供货单审批） -->
<template>
  <ep-dialog title="审批" iconTitle="form" v-model="visible" width="720px" top="5vh" append-to-body v-loading="loading">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="130px">
      <el-form-item label="审批状态：" prop="status">
        <el-radio-group v-model="formData.status" @change="changeRadio">
          <el-radio :value="'1'">通过</el-radio>
          <el-radio :value="'2'" v-if="activityList.length > 0">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审批意见：" prop="message">
        <el-input v-model="formData.message" type="textarea" :rows="5" maxlength="100" placeholder="请输入审批意见" />
      </el-form-item>
      <el-form-item v-if="formData.status == 2" label="驳回节点：" prop="activityId">
        <el-select v-model="formData.activityId" placeholder="请选择驳回节点" clearable style="width: 100%">
          <el-option v-for="item in activityList" :key="item.activityId" :label="item.activityName"
            :value="item.activityId" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button type="primary" class="determine-btn" @click="btnBack"><svg-icon
            icon-class="determine" />&nbsp;保存</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup name="process-approval">
// 无工作流：暂不使用 taskNextFlowNode（import { taskNextFlowNode } from '@/api/workflow'），将来接入工作流放开
const { proxy } = getCurrentInstance()

const emit = defineEmits(['saveProcessApproval'])

const visible = ref(false)
const loading = ref(false)
const formRef = ref(null)
const ids = ref([])
const activityList = ref([])

const formData = ref({
  status: '1',
  message: '',
  activityId: '',
})

const rules = {
  status: [{ required: true, message: '请选择审批结果！', trigger: 'change' }],
  message: [{ required: true, message: '请输入审批意见！', trigger: 'blur' }],
  activityId: [{ required: true, message: '请选择驳回节点！', trigger: 'change' }],
}

/** 打开弹窗 */
function init(businessIds) {
  ids.value = businessIds || []
  visible.value = true
  formData.value = { status: '1', message: '', activityId: '' }
  proxy.$nextTick(() => formRef.value && formRef.value.clearValidate())
  changeRadio()
}

/** 审批状态切换时加载驳回节点（无工作流：不查询节点，将来接入工作流放开 taskNextFlowNode 调用） */
function changeRadio() {
  if (formData.value.status === '2') {
    // taskNextFlowNode({ businessKey: ids.value[0] }).then(({ data }) => {
    //   activityList.value = data || []
    // }).catch(() => {
    //   activityList.value = []
    // }).finally(() => {
    //   loading.value = false
    // })
  }
}

function btnBack() {
  formRef.value.validate(valid => {
    if (!valid) return
    emit('saveProcessApproval', {
      businessIds: ids.value,
      ...formData.value,
      rejectToSubmitUser: formData.value.status == '2' && formData.value.activityId == activityList.value[0]?.activityId ? '1' : '0',
    })
    visible.value = false
  })
}

defineExpose({
  init,
})
</script>
<style lang="scss" scoped></style>
