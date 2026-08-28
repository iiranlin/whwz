<template>
  <ep-dialog title="重置密码" v-model="visible" width="420px" top="12vh" append-to-body>
    <el-form ref="pwdFormRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="用户账号：">
        <el-input :model-value="userInfo.username" disabled />
      </el-form-item>
      <el-form-item label="新密码：" prop="password">
        <el-input v-model="form.password" type="password" placeholder="8-20位，含大小写字母、数字、特殊字符" show-password />
      </el-form-item>
      <el-form-item label="确认密码：" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
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
import { resetPwd } from '@/api/base/user'

const { proxy } = getCurrentInstance()

const visible = ref(false)
const userInfo = ref({})

const form = reactive({
  password: '',
  confirmPassword: ''
})

const validateConfirm = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  password: [
    { required: true, trigger: 'blur', message: '请输入新密码' },
    {
      pattern: /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,20}$/,
      trigger: 'blur',
      message: '密码需为8-20位，且包含大小写字母、数字、特殊字符'
    }
  ],
  confirmPassword: [
    { required: true, trigger: 'blur', message: '请再次输入新密码' },
    { validator: validateConfirm, trigger: 'blur' }
  ]
}
/** 监听弹窗关闭，重置表单数据和校验 */
watch(visible, (val) => {
  if (!val) {
    proxy.$nextTick(() => {
      proxy.$refs.pwdFormRef && proxy.$refs.pwdFormRef.resetFields()
    })
  }
})

// 打开弹窗
function init(row) {
  visible.value = true
  userInfo.value = row
  form.password = ''
  form.confirmPassword = ''
}

// 提交
function submit() {
  proxy.$refs.pwdFormRef.validate(valid => {
    if (!valid) return
    resetPwd({ id: userInfo.value.id, password: form.password }).then(({ message }) => {
      proxy.$modal.msgSuccess(message)
      visible.value = false
    })
  })
}

defineExpose({
  init
})
</script>
