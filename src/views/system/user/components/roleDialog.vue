<template>
  <ep-dialog title="分配角色" v-model="visible" width="460px" top="10vh" append-to-body v-loading="loading">
    <div class="role-dialog__title">用户：{{ userInfo.nickName || userInfo.username }}</div>
    <el-checkbox-group v-model="checkedRoleIds" class="role-dialog__group">
      <el-checkbox v-for="role in roleList" :key="role.id" :value="role.id">{{ role.roleName }}（{{ role.roleCode }}）</el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { roleListAll } from '@/api/base/role'
import { userRoleList, userBindRole } from '@/api/base/user'

const { proxy } = getCurrentInstance()

const emit = defineEmits(['success'])
const visible = ref(false)
const loading = ref(false)
const roleList = ref([])
const checkedRoleIds = ref([])
const userInfo = ref({})

// 打开弹窗
function init(row) {
  let roleIds = row.roleId ? row.roleId.split(',') : []
  visible.value = true
  userInfo.value = row
  checkedRoleIds.value = roleIds
  loading.value = true
  roleListAll().then(({ data }) => {
    // 标品系统中暂未调用这个接口
    // roleList.value = data || []
  })
  userRoleList(row.id).then(({ data }) => {
    roleList.value = data || []
    // checkedRoleIds.value = (data || []).map(item => item.id)
  }).finally(() => {
    loading.value = false
  })
}

// 提交
function submit() {
  loading.value = true
  userBindRole({ roleIds: checkedRoleIds.value }, userInfo.value.id).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    visible.value = false
    emit('success')
  }).finally(() => {
    loading.value = false
  })
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.role-dialog {
  &__title {
    font-weight: 600;
    margin-bottom: 12px;
    padding-left: 10px;
  }

  &__group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 400px;
    overflow-y: auto;
    padding-left: 30px;
  }
}
</style>
