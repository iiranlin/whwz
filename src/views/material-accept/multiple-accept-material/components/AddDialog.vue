<template>
  <ep-dialog :title="title" iconTitle="form" v-model="visible" width="800px" top="5vh" append-to-body
    :close-on-press-escape="false" :close-on-click-model="false">
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="120px">
        <el-row class="form-left flex1">
          <el-col :span="12">
            <el-form-item label="物资分类编号：" prop="matlCode">
              <el-input v-model.trim="formData.matlCode" placeholder="请选择物资分类编号" readonly>
                <template #append>
                  <el-button :icon="Search" style="height: 28px;" @click="handleGroupCode" :disabled="dialogType != 'create'"></el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物资分类名称：" prop="matlName">
              <el-input v-model.trim="formData.matlName" placeholder="请输入物资分类名称" readonly/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="验收分组名称：" prop="allGroupName">
              <el-input v-model.trim="formData.allGroupName" placeholder="请选择验收分组名称" readonly>
                <template #append>
                  <el-button :icon="Search" style="height: 28px;" @click="handleClassFlag"></el-button>
                </template>
              </el-input>
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
  <Group v-model="groupVisible" @selectData="selectData" />
  <ClassifyDialog v-model="classifyVisible" @selectedItems="selectedItems" :acceptanceGroups="formData.acceptanceGroups"/>

</template>

<script setup>
import { paramConfigAdd, paramConfigModify } from '@/api/materialAccept/acceptMaterial'
import { Search } from '@element-plus/icons-vue'
import ClassifyDialog from './ClassifyDialog.vue'
import Group from './Group.vue'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const title = ref('多次验收物资维护')

const formData = ref({
  acceptanceGroups: []
})
const rules = reactive({
  matlCode: [{ required: true, message: '请选择物资分类编号', trigger: ['blur', 'change'] }],
  matlName: [{ required: true, message: '请输入物资分类名称', trigger: ['blur', 'change'] }],
  allGroupName: [{ required: true, message: '请选择验收分组名称', trigger: ['blur', 'change'] }],
})


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
      formData.value.acceptanceGroups = row.acceptanceGroups
    }else{
       formData.value.acceptanceGroups = []
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
      submit(
        {
          ...formData.value,
        }
    ).then(({ message }) => {
        proxy.$modal.msgSuccess(message)
        visible.value = false
        emit('createSuccess')
      }).finally(() => {
        proxy.$modal.closeLoading()
      })
    }
  })
}

const groupVisible = ref(false)
const handleGroupCode = () => {
  groupVisible.value = true

}

const classifyVisible = ref(false)
const handleClassFlag = () => {
  classifyVisible.value = true
}
const selectData = (row) => {
  formData.value.matlCode = row.matlCode
  formData.value.matlName = row.matlName

}
const selectedItems = (row) => {
  formData.value.allGroupName = row?.map(item => item.groupName).join(',')
  formData.value.acceptanceGroups = row
}


defineExpose({
  show,
})
</script>
<style lang="scss" scoped></style>