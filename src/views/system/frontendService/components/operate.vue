<template>
  <ep-dialog :title="title" v-model="visible" width="620px" top="8vh" append-to-body v-loading="loading">
    <el-form ref="elFormRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="服务编码：" prop="serviceCode">
        <el-input v-model="form.serviceCode" placeholder="请输入服务编码" :disabled="type === 'update'" />
      </el-form-item>
      <el-form-item label="服务名称：" prop="serviceName">
        <el-input v-model="form.serviceName" placeholder="请输入服务名称" />
      </el-form-item>
      <el-form-item label="服务地址：" prop="serviceUrl">
        <el-input v-model="form.serviceUrl" placeholder="请输入服务地址" />
      </el-form-item>
      <el-form-item label="服务类型：" prop="serviceType">
        <el-select v-model="form.serviceType" placeholder="请选择服务类型" style="width: 100%">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-radio-group v-model="form.status">
          <el-radio :value="0">启用</el-radio>
          <el-radio :value="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="服务说明：" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入服务说明" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { serviceSave, serviceDetail, serviceDict } from '@/api/base/frontend'

const { proxy } = getCurrentInstance()

const visible = ref(false)
const loading = ref(false)
const title = ref('新增服务')
const type = ref('create')
const id = ref('')
const typeOptions = ref([])

const data = reactive({
  form: {
    serviceCode: '',
    serviceName: '',
    serviceUrl: '',
    serviceType: undefined,
    status: 0,
    description: ''
  },
  rules: {
    serviceCode: [{ required: true, message: '服务编码不能为空', trigger: 'blur' }],
    serviceName: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }]
  }
})

const { form, rules } = toRefs(data)

const emit = defineEmits(['createSuccess'])

// 服务类型字典
function getTypeDict() {
  serviceDict().then(({ data }) => {
    typeOptions.value = (data || []).map(item => ({ value: item.code || item.value, label: item.name || item.label }))
  })
}

// 打开弹窗
function init(dialogType, rowId) {
  visible.value = true
  type.value = dialogType
  id.value = rowId || ''
  getTypeDict()
  if (dialogType === 'update') {
    title.value = '修改服务'
    serviceDetail(rowId).then(({ data }) => {
      form.value = data || {}
    })
  } else {
    title.value = '新增服务'
  }
}

// 提交
function submit() {
  proxy.$refs.elFormRef.validate(valid => {
    if (!valid) return
    loading.value = true
    serviceSave({ ...form.value, id: id.value }).then(({ message }) => {
      proxy.$modal.msgSuccess(message)
      visible.value = false
      emit('createSuccess')
    }).finally(() => {
      loading.value = false
    })
  })
}

defineExpose({
  init
})
</script>
