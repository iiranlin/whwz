<template>
  <ep-dialog :title="dialogType == 'create'?'新增设备字典':'修改设备字典'" iconTitle="form" v-model="visible" width="800px" top="5vh" append-to-body>
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="120px"> 
        <div class="form-left flex1">
          <el-form-item label="设备编码：" prop="equipCode">
            <el-input v-model="formData.equipCode" :disabled="dialogType != 'create'" placeholder="请输入设备编码" />
          </el-form-item>
          <el-form-item label="简拼：" prop="equipSpell">
            <el-input v-model="formData.equipSpell" placeholder="请输入简拼" />
          </el-form-item>
          <el-form-item label="设备名称：" prop="equipName">
            <el-input v-model="formData.equipName" placeholder="请输入设备名称" />
          </el-form-item>
          <el-form-item label="设备类型：" prop="equipType">
            <el-input v-model="formData.equipType" placeholder="请输入设备类型" />
          </el-form-item>
          <el-form-item label="上级编码：" prop="parentCode">
            <el-input v-model="formData.parentCode" placeholder="请输入上级编码" />
          </el-form-item>
          <el-form-item label="原始价值：" prop="originalValue">
            <el-input v-model="formData.originalValue" v-number-input.float="2" placeholder="请输入原始价值" />
          </el-form-item>
          <el-form-item label="配属部门：" prop="deptId">
            <el-tree-select v-model="formData.deptId" :data="deptTreeData" :props="{children: 'children', label: 'deptName'}" node-key="id" check-strictly :render-after-expand="false"
              :disabled="formData.isOneLevel == '1'" filterable clearable/>
          </el-form-item>
          <el-form-item label="生产日期：" prop="makeDate">
            <el-date-picker v-model="formData.makeDate" type="date" format="YYYY-MM-DD" value-format="x" placeholder="请选择生产日期" />
          </el-form-item>
          <el-form-item label="使用日期：" prop="useDate">
            <el-date-picker v-model="formData.useDate" type="date" format="YYYY-MM-DD" value-format="x" placeholder="请选择使用日期" />
          </el-form-item>
          <el-form-item label="生产厂家：" prop="maker">
            <el-input v-model="formData.maker" placeholder="请输入生产厂家" />
          </el-form-item>
          <el-form-item label="是否有效：" prop="status">
            <el-select v-model="formData.status" placeholder="请选择是否有效" clearable>
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="comments" label="备注：" style="width: 672px;">
            <el-input type="textarea" v-limit-text-len="200" v-model="formData.comments" placeholder="请输入备注" />
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
import { equipDictCreateModify } from '@/api/warehouse/equipDict'
import { deptTree } from '@/api/base/dept'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const dialogType = ref('create')

const data = reactive({
  formData: {
    equipCode: '',
    equipSpell: '',
    equipName: '',
    equipType: '',
    parentCode: '',
    originalValue: '',
    deptId: '',
    makeDate: '',
    useDate: '',
    maker: '',
    status: '1',
    comments: ''
  },
  rules: {
    equipCode: [{ required: true, message: '请输入设备编码', trigger: 'blur' }],
    equipName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
    status: [{ required: true, message: '请选择是否启用', trigger: ['blur', 'change']}],
  },
  deptTreeData: []
})

const { formData, rules, deptTreeData } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

const getDeptTree = () => {
  deptTree().then( ({data}) => {
    deptTreeData.value = data || []
  })
}

// 显示弹框
function show(type, row = {}) {
  visible.value = true
  dialogType.value = type
  getDeptTree()
	proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    formData.value = Object.assign({}, formData.value, row)
  })

}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      proxy.$modal.loading()
      equipDictCreateModify(formData.value, dialogType.value).then( ({message}) => {
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