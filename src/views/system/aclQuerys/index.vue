<template>
  <div class="app-container app-container-tabs">
    <el-tabs v-model="activeName">
      <el-tab-pane label="按角色查询" name="role">
        <role-list v-if="renderedTabs.role" />
      </el-tab-pane>
      <el-tab-pane label="按用户查询" name="user">
        <user-list v-if="renderedTabs.user" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup name="system-aclQuerys">
import RoleList from './components/roleList'
import UserList from './components/userList'

const activeName = ref('role')
// Tab 懒渲染：切换过即保留（保持各 Tab 查询状态）
const renderedTabs = reactive({ role: true, user: false })

watch(activeName, val => { renderedTabs[val] = true })
</script>

<style lang="scss" scoped>
.app-container-tabs {
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep(.el-tabs) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  :deep(.el-tabs__content) {
    flex: 1;
    overflow: hidden;

    .el-tab-pane {
      height: 100%;
    }
  }
}
</style>
