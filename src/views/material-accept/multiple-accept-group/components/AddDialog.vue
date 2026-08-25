<template>
  <ep-dialog :title="title" iconTitle="form" v-model="visible" width="800px" top="5vh" append-to-body>
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="120px">
        <el-row class="form-left flex1">
          <el-col :span="12">
            <el-form-item label="验收分组编号：" prop="groupCode">
              <el-input v-model.trim="formData.groupCode" placeholder="请输入验收分组编号" :disabled="dialogType != 'create'" :maxlength="30"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="验收分组名称：" prop="groupName">
              <el-input v-model.trim="formData.groupName" placeholder="请输入验收分组名称" :maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="验收次序：" prop="classFlag">
              <el-select v-model="formData.classFlag" placeholder="请选择验收次序" clearable
                :disabled="dialogType != 'create'">
                <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;{{
          dialogType === 'create' ? '保存' : '确定' }}</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { paramConfigAdd, paramConfigModify } from '@/api/materialAccept/acceptGroup'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const title = ref('多次验收分组维护')

const data = reactive({
  formData: {},
  rules: {
    groupCode: [{ required: true, message: '请输入验收分组编号', trigger: ['blur', 'change'] }],
    groupName: [{ required: true, message: '请输入验收分组名称', trigger: ['blur', 'change'] }],
    classFlag: [{ required: true, message: '请选择验收次序', trigger: ['blur', 'change'] }],
  },
})

const { formData, rules } = toRefs(data)

const statusArr = ref([
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
])



// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);
const dialogType = ref('')

// 显示弹框
const show = (type, row = {}) => {
  visible.value = true
  dialogType.value = type
  proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    if (dialogType.value === 'modify') {
      formData.value = row
    }else if(dialogType.value === 'create'){
      formData.value = Object.assign({})
    }
    formData.value = Object.assign({}, formData.value, row)
  })
}

const saveBtn = () => {
  let submit
  if (dialogType.value === 'modify') {
    submit = paramConfigModify
  } else {
    submit = paramConfigAdd
  }
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      proxy.$modal.loading()
      submit(formData.value).then(({ message }) => {
        proxy.$modal.msgSuccess(message)
        visible.value = false
        emit('createSuccess')
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