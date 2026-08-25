<template>
  <div class="navbar">
    <div class="navbar-breadcrumb">
      <span class="navbar-title">{{ pageTitle }}</span>
    </div>
    <div class="navbar-right">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="navbar-user">
          <span class="navbar-avatar">{{ avatarChar }}</span>
          <span class="navbar-username">{{ username }}</span>
          <el-icon class="navbar-arrow"><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const username = computed(() => userStore.userInfo.username || userStore.userInfo.nickName || '用户')
// 头像首字：优先取昵称首字
const avatarChar = computed(() => {
  const name = userStore.userInfo.nickName || userStore.userInfo.username || '用'
  return name.charAt(0).toUpperCase()
})
const pageTitle = computed(() => (route.meta && route.meta.title) || '')

// 退出登录
function handleCommand(command) {
  if (command === 'logout') {
    ElMessageBox.confirm('确定退出登录吗？', '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      userStore.logOut().then(() => {
        router.push('/login')
        ElMessage.success('退出成功')
      })
    }).catch(() => {})
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;

  .navbar-breadcrumb {
    .navbar-title {
      font-size: 15px;
      font-weight: 500;
      color: #303133;
    }
  }

  .navbar-right {
    .navbar-user {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      color: #303133;
      padding: 4px 10px;
      border-radius: 20px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f2f3f5;
      }

      .navbar-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: #fff;
        font-size: 13px;
        font-weight: 600;
        flex-shrink: 0;
      }

      .navbar-username {
        font-size: 14px;
      }

      .navbar-arrow {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}
</style>
