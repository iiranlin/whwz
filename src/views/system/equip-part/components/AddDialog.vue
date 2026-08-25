<template>
  <ep-dialog :title="dialogType == 'create'?'新增设备部件':'修改设备部件'" iconTitle="form" v-model="visible" width="800px" top="5vh" append-to-body>
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="120px"> 
        <div class="form-left flex1">
          <el-form-item label="部件编码：" prop="epPartCode">
            <el-input v-model="formData.epPartCode" :disabled="dialogType != 'create'" placeholder="请输入部件编码" />
          </el-form-item>
          <el-form-item label="部件名称：" prop="epPartName">
            <el-input v-model="formData.epPartName" placeholder="请输入部件名称" />
          </el-form-item>
          <el-form-item label="所属设备：" prop="equipId">
            <el-select v-model="formData.equipId" placeholder="请选择所属设备" clearable>
              <el-option v-for="item in equipDictData" :key="item.id" :label="item.equipName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图号：" prop="pcode">
            <el-input v-model="formData.pcode" placeholder="请输入图号" />
          </el-form-item>
          <el-form-item prop="proline" label="生产线：" style="width: 672px;">
            <el-input type="textarea" v-limit-text-len="200" v-model="formData.proline" placeholder="请输入生产线" />
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
import { statusArr } from '@/utils/dictionary'
import { equipPartCreateModify } from '@/api/warehouse/equipPart'
import { equipDictListAll } from '@/api/warehouse/equipDict'
import { deptTree } from '@/api/system/common'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const dialogType = ref('create')

const data = reactive({
  formData: {
    epPartCode: '',
    epPartName: '',
    equipId: '',
    pcode: '',
    proline: ''
  },
  rules: {
    epPartCode: [{ required: true, message: '请输入部件编码', trigger: 'blur' }],
    epPartName: [{ required: true, message: '请输入部件名称', trigger: 'blur' }],
    equipId: [{ required: true, message: '请选择所属设备', trigger: ['blur', 'change']}],
  },
  equipDictData: []
})

const { formData, rules, equipDictData } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

const getEquipDictListAll = () => {
  equipDictListAll().then( ({data}) => {
    equipDictData.value = data || []
  })
}

// 显示弹框
function show(type, row = {}) {
  visible.value = true
  dialogType.value = type
  getEquipDictListAll()
	proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    formData.value = Object.assign({}, formData.value, row)
  })

}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      proxy.$modal.loading()
      equipPartCreateModify(formData.value, dialogType.value).then( ({message}) => {
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