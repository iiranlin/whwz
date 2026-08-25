<template>
  <ep-dialog title="提示" iconTitle="form" v-model="visible" width="800px" top="5vh" append-to-body>
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="120px"> 
        <div class="form-left flex1">
          <el-form-item prop="deleteMsg" label="删除理由：" style="width: 672px;">
            <el-input type="textarea" v-limit-text-len="200" v-model="formData.deleteMsg" placeholder="请输入删除理由" />
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
import { rmstorInternalDeleteBatch } from '@/api/warehouse/rmstorInternal'
const { proxy } = getCurrentInstance()

const visible = ref(false)

const dataIds = ref([])

const deleteMsgValidator = (rule, value, callback) => {
  if(/\S/.test(value)){
    callback()
  }else{
    callback('删除理由不能为空！')
  }
}

const data = reactive({
  formData: {
    deleteMsg: ''
  },
  rules: {
    deleteMsg: [{ required: true, validator: deleteMsgValidator, trigger: 'blur' }],
  },
})

const { formData, rules } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['deleteSuccess']);

// 显示弹框
function show(ids = []) {
  visible.value = true
  dataIds.value = ids
	proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
  })
}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      proxy.$modal.loading()
      rmstorInternalDeleteBatch({...formData.value, ids: dataIds.value}).then( ({message}) => {
          proxy.$modal.msgSuccess(message)
          visible.value = false
          emit('deleteSuccess')
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