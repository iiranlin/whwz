<template>
  <div class="app-wrapper">
    <!-- 左侧菜单 -->
    <div class="sidebar-container">
      <div class="sidebar-logo">
        <img class="sidebar-logo-img" :src="logoImg" alt="logo" />
        <h1 class="sidebar-title">{{ title }}</h1>
      </div>
      <el-scrollbar class="sidebar-scrollbar">
        <Sidebar />
      </el-scrollbar>
    </div>
    <!-- 右侧主区域 -->
    <div class="main-container">
      <Navbar />
      <div class="app-main">
        <!-- 用错误边界包裹 router-view：页面渲染异常时显示占位，防止组件树损坏导致后续菜单全部无法渲染 -->
        <RouterErrorBoundary>
          <router-view :key="route.path" />
        </RouterErrorBoundary>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'
import RouterErrorBoundary from '@/components/RouterErrorBoundary/index.vue'
import logoImg from '@/assets/logo/logo.png'

const route = useRoute()
// 侧边栏宽度有限，使用精简名称；完整名称见登录页/浏览器标题
const title = '物资管理信息系统'
</script>

<style lang="scss" scoped>
.app-wrapper {
  height: 100%;
  width: 100%;
}

.sidebar-container {
  width: 210px;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  background: linear-gradient(180deg, #0f3273 0%, #14418c 100%);
  display: flex;
  flex-direction: column;

  .sidebar-logo {
    height: 60px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 16px;
    background: linear-gradient(135deg, #0d2b61 0%, #123a84 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    overflow: hidden;

    .sidebar-logo-img {
      width: 32px;
      height: 32px;
      object-fit: contain;
      border-radius: 8px;
      background: #fff;
      flex-shrink: 0;
    }

    .sidebar-title {
      margin: 0;
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .sidebar-scrollbar {
    flex: 1;
    overflow: hidden;
  }
}

.main-container {
  height: 100%;
  margin-left: 210px;
  position: relative;
  // background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  overflow: auto;
  padding: 10px;
}
</style>
