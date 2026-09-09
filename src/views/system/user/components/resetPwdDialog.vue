<template>
  <ep-dialog title="重置密码" v-model="visible" width="420px" top="12vh" append-to-body>
    <div class="reset-pwd-tip">
      <p>用户账号：{{ userInfo.username }}</p>
      <p>重置后该用户密码将恢复为初始密码 <b>Train@89xy</b>，用户首次登录需修改密码。</p>
    </div>
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

// 打开弹窗
function init(row) {
  visible.value = true
  userInfo.value = row
}

// 提交
function submit() {
  resetPwd({ id: userInfo.value.id }).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    visible.value = false
  })
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.reset-pwd-tip {
  line-height: 1.8;
  font-size: 14px;
  color: #606266;
  p {
    margin: 0 0 8px;
  }
  b {
    color: #f56c6c;
  }
}
</style>
