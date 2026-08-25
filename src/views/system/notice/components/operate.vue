<template>
  <ep-dialog :title="title" v-model="visible" width="700px" top="5vh" append-to-body v-loading="loading">
    <el-form ref="elFormRef" :model="form" :rules="rules" label-width="85px">
      <el-form-item label="通知标题：" prop="noticeTitle">
        <el-input v-model="form.noticeTitle" maxlength="50" placeholder="请输入通知标题" />
      </el-form-item>
      <el-form-item label="通知内容：" prop="noticeMessage">
        <Editor v-model="form.noticeMessage" :min-height="200" />
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
import { noticeCreate, noticeDetail, noticeModify } from '@/api/base/notice'

const { proxy } = getCurrentInstance()

const visible = ref(false)
const loading = ref(false)
const title = ref('新增通知')
const type = ref('create')
const id = ref('')

const data = reactive({
  form: {
    noticeTitle: '',
    noticeMessage: ''
  },
  rules: {
    noticeTitle: [
      { required: true, message: '通知标题不能为空', trigger: 'blur' }
    ]
  }
})

const { form, rules } = toRefs(data)

const emit = defineEmits(['createSuccess'])

// 打开弹窗
function init(dialogType, rowId) {
  visible.value = true
  type.value = dialogType
  id.value = rowId || ''
  form.value.noticeTitle = ''
  form.value.noticeMessage = ''
  if (dialogType === 'update') {
    title.value = '修改通知'
    noticeDetail(rowId).then(({ data }) => {
      form.value = data
    })
  } else {
    title.value = '新增通知'
  }
}

// 提交
function submit() {
  proxy.$refs.elFormRef.validate(valid => {
    if (!valid) return
    loading.value = true
    const request = type.value === 'create'
      ? noticeCreate(form.value)
      : noticeModify({ ...form.value, id: id.value })
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
