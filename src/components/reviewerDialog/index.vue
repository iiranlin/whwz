<template>
  <el-dialog class="dialog" v-model="visible" width="800px" top="5vh" append-to-body>
    <template #header>
      <span><svg-icon icon-class="form" /> 选择下一级审核人</span>
    </template>
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="120px"> 
        <div class="form-left flex1">
          <el-form-item prop="auditUserId" label="下一级审核人：" v-if="assigneeList.length > 1">
            <el-select v-model="formData.auditUserId" placeholder="请选择下一级审核人" clearable style="width: 300px;">
              <el-option v-for="item in assigneeList" :key="item.id" :label="item.userName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="comment" label="通过原因：" v-if="!urlType">
            <el-input type="textarea" v-model="formData.comment" placeholder="请输入通过原因" style="width: 600px;" />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const { proxy } = getCurrentInstance()

const props = defineProps({
  multiple: {
    type: Boolean,
    default: false
  },
  success: {
    type: Function,
    default: null
  },
  remove: {
    type: Function,
    default: null
  },
  urlType: {
    type: Boolean,
    default: true
  },
})

const visible = ref(false)

const assigneeList = ref([])

const data = reactive({
  formData: {
    auditUserId: '',
    comment: ''
  },
  rules: {
    auditUserId: [{ required: true, message: '请选择下一级审核人', trigger: ['blur', 'change'] }],
  },
})

const { formData, rules } = toRefs(data)

watch(visible, val => {
  if(!val){
    props.remove && props.remove()
  }
})

// 显示弹框
function init(data) {
  visible.value = true
  assigneeList.value = data
	proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    if (data.length === 1 && data[0]) {
      formData.value.auditUserId = data[0].id
    }
  })
}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      visible.value = false
      props.success && props.success(formData.value)
    }
  })
}

defineExpose({
  init,
})
</script>
<style lang="scss" scoped>
</style>