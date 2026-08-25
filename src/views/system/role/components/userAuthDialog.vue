<template>
  <ep-dialog title="分配用户" v-model="visible" width="900px" top="6vh" append-to-body>
    <div class="user-auth">
      <div class="user-auth__title">角色：{{ roleName }}</div>
      <div class="user-auth__body">
        <!-- 未授权用户 -->
        <div class="user-auth__list">
          <div class="user-auth__list-title">未授权用户</div>
          <el-input v-model="unallocatedQuery.username" placeholder="请输入用户名" clearable style="margin-bottom: 8px" @change="getUnallocatedList" />
          <el-table :data="unallocatedList" border height="360" @selection-change="unallocatedSelectionChange">
            <el-table-column type="selection" width="45" align="center" />
            <el-table-column prop="username" label="用户名" min-width="100" />
            <el-table-column prop="nickName" label="姓名" min-width="100" />
          </el-table>
          <el-button type="primary" class="user-auth__move-btn" @click="handleAuthUser">添加授权 →</el-button>
        </div>
        <!-- 已授权用户 -->
        <div class="user-auth__list">
          <div class="user-auth__list-title">已授权用户</div>
          <el-input v-model="allocatedQuery.username" placeholder="请输入用户名" clearable style="margin-bottom: 8px" @change="getAllocatedList" />
          <el-table :data="allocatedList" border height="360" @selection-change="allocatedSelectionChange">
            <el-table-column type="selection" width="45" align="center" />
            <el-table-column prop="username" label="用户名" min-width="100" />
            <el-table-column prop="nickName" label="姓名" min-width="100" />
          </el-table>
          <el-button type="danger" class="user-auth__move-btn" @click="handleCancelAuth">← 取消授权</el-button>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="visible = false">关 闭</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { allocatedUserList, unallocatedUserList, authUser, authUserCancel } from '@/api/base/role'

const { proxy } = getCurrentInstance()

const visible = ref(false)
const roleId = ref('')
const roleName = ref('')
const unallocatedList = ref([])
const allocatedList = ref([])
const unallocatedSelection = ref([])
const allocatedSelection = ref([])

const data = reactive({
  unallocatedQuery: { pageNum: 1, pageSize: 100, username: '' },
  allocatedQuery: { pageNum: 1, pageSize: 100, username: '' }
})

const { unallocatedQuery, allocatedQuery } = toRefs(data)

/** 未授权用户 */
function getUnallocatedList() {
  unallocatedUserList({ ...unallocatedQuery.value, roleId: roleId.value }).then(({ data }) => {
    unallocatedList.value = data.list || data.records || []
  })
}

/** 已授权用户 */
function getAllocatedList() {
  allocatedUserList({ ...allocatedQuery.value, roleId: roleId.value }).then(({ data }) => {
    allocatedList.value = data.list || data.records || []
  })
}

function unallocatedSelectionChange(rows) {
  unallocatedSelection.value = rows
}

function allocatedSelectionChange(rows) {
  allocatedSelection.value = rows
}

/** 添加授权 */
function handleAuthUser() {
  if (!unallocatedSelection.value.length) {
    proxy.$modal.msgWarning('请选择要授权的用户')
    return
  }
  const ids = unallocatedSelection.value.map(item => item.id)
  authUser(roleId.value, { ids }).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    getUnallocatedList()
    getAllocatedList()
  })
}

/** 取消授权 */
function handleCancelAuth() {
  if (!allocatedSelection.value.length) {
    proxy.$modal.msgWarning('请选择要取消授权的用户')
    return
  }
  const ids = allocatedSelection.value.map(item => item.id)
  authUserCancel(roleId.value, { ids }).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    getUnallocatedList()
    getAllocatedList()
  })
}

/** 打开弹窗 */
function init(row) {
  visible.value = true
  roleId.value = row.id
  roleName.value = row.roleName || row.roleCode
  getUnallocatedList()
  getAllocatedList()
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.user-auth {
  &__title {
    font-weight: 600;
    margin-bottom: 10px;
  }

  &__body {
    display: flex;
    gap: 20px;
  }

  &__list {
    flex: 1;
  }

  &__list-title {
    margin-bottom: 8px;
    font-weight: 500;
  }

  &__move-btn {
    margin-top: 10px;
    width: 100%;
  }
}
</style>
