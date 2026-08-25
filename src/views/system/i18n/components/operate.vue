<template>
  <ep-dialog :title="title" v-model="visible" width="560px" top="10vh" append-to-body v-loading="loading">
    <el-form ref="elFormRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="词条编码：" prop="i18nCode">
        <el-input v-model="form.i18nCode" placeholder="请输入词条编码" :disabled="type === 'update'" />
      </el-form-item>
      <el-form-item label="词条KEY：" prop="i18nKey">
        <el-input v-model="form.i18nKey" placeholder="请输入词条KEY" :disabled="type === 'update'" />
      </el-form-item>
      <el-form-item label="词条值：" prop="i18nValue">
        <el-input v-model="form.i18nValue" placeholder="请输入词条值" />
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
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
import { i18nCreate, i18nModify } from '@/api/base/i18n'

const { proxy } = getCurrentInstance()

const visible = ref(false)
const loading = ref(false)
const title = ref('新增词条')
const type = ref('create')
const id = ref('')

const data = reactive({
  form: {
    i18nCode: '',
    i18nKey: '',
    i18nValue: '',
    remark: ''
  },
  rules: {
    i18nCode: [{ required: true, message: '词条编码不能为空', trigger: 'blur' }],
    i18nKey: [{ required: true, message: '词条KEY不能为空', trigger: 'blur' }],
    i18nValue: [{ required: true, message: '词条值不能为空', trigger: 'blur' }]
  }
})

const { form, rules } = toRefs(data)

const emit = defineEmits(['createSuccess'])

// 打开弹窗
function init(dialogType, rowId) {
  visible.value = true
  type.value = dialogType
  id.value = rowId || ''
  form.value.i18nCode = ''
  form.value.i18nKey = ''
  form.value.i18nValue = ''
  form.value.remark = ''
  if (dialogType === 'update') {
    title.value = '修改词条'
  } else {
    title.value = '新增词条'
  }
}

// 提交
function submit() {
  proxy.$refs.elFormRef.validate(valid => {
    if (!valid) return
    loading.value = true
    const request = type.value === 'create'
      ? i18nCreate(form.value)
      : i18nModify({ ...form.value, id: id.value })
    request.then(({ message }) => {
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
