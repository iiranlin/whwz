<template>
  <div class="dashboard">
    <!-- 欢迎横幅 -->
    <div class="hero">
      <div class="hero-orb orb1"></div>
      <div class="hero-orb orb2"></div>
      <div class="hero-ring"></div>
      <div class="hero-left">
        <div class="greeting">{{ greeting }}，{{ username }}</div>
        <div class="sys-name">仓储业务信息管理系统</div>
        <div class="sys-en">WAREHOUSE MANAGEMENT SYSTEM</div>
      </div>
      <div class="hero-right">
        <div class="date">{{ todayText }}</div>
        <div class="unit">{{ unitName }}</div>
      </div>
    </div>
    <!-- 数据概览 -->
    <div class="stat-grid">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <div class="stat-icon" :style="{ background: s.color }">
          <el-icon :size="22"><component :is="s.icon" /></el-icon>
        </div>
        <div class="stat-text">
          <div class="stat-value">{{ s.value }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>
    </div>
    <!-- 快捷导航 -->
    <div class="block-title">快捷导航</div>
    <div class="nav-grid">
      <div v-for="(item, i) in navItems" :key="item.path" class="nav-card" @click="go(item.target)">
        <div class="nav-icon" :style="{ background: palette[i % palette.length] }">{{ item.title.charAt(0) }}</div>
        <div class="nav-text">
          <div class="nav-name">{{ item.title }}</div>
          <div class="nav-sub">{{ item.count > 0 ? item.count + ' 个子菜单' : '直接进入' }}</div>
        </div>
        <div class="nav-arrow">›</div>
      </div>
    </div>
    <!-- 底部双栏 -->
    <div class="bottom-grid">
      <div class="panel">
        <div class="block-title">系统信息</div>
        <div class="info-card">
          <div class="info-item"><span class="label">系统名称</span><span class="value">中国铁路武汉局集团有限公司仓储业务信息管理系统</span></div>
          <div class="info-item"><span class="label">当前版本</span><span class="value">V3.0</span></div>
          <div class="info-item"><span class="label">登录账号</span><span class="value">{{ username }}</span></div>
          <div class="info-item"><span class="label">所属单位</span><span class="value">{{ unitName }}</span></div>
        </div>
      </div>
      <div class="panel">
        <div class="block-title">使用提示</div>
        <div class="tip-card">
          <div class="tip-item">通过左侧菜单切换各业务模块，菜单内容与您的账号权限保持一致。</div>
          <div class="tip-item">点击上方快捷导航卡片，可直达对应业务模块的第一个页面。</div>
          <div class="tip-item">列表页支持条件查询与分页浏览，表格区域内滚动查看数据。</div>
          <div class="tip-item">如遇菜单或权限问题，请联系系统管理员处理。</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import useUserStore from '@/store/modules/user'
import usePermissionStore from '@/store/modules/permission'
import { getCookie } from '@/utils/auth'

const router = useRouter()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

const username = computed(() => userStore.userInfo.username || userStore.userInfo.nickName || '用户')
const unitName = computed(() => getCookie('unitName') || '-')

// 时段问候
const hour = new Date().getHours()
const greeting = hour < 5 ? '夜深了' : hour < 11 ? '早上好' : hour < 13 ? '中午好' : hour < 18 ? '下午好' : '晚上好'

const weekNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const now = new Date()
const todayText = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${weekNames[now.getDay()]}`

// 取菜单第一个可见叶子的完整路径，作为快捷入口跳转目标
function firstLeafPath(route) {
  const children = (route.children || []).filter(c => !c.hidden)
  if (children.length === 0) return route.path
  return firstLeafPath(children[0])
}

// 快捷导航：取侧边栏顶级业务菜单（排除工作台自身），菜单变化自动同步
const navItems = computed(() =>
  permissionStore.sidebarRouters
    .filter(r => !r.hidden && r.path !== '/dashboard')
    .map(r => ({
      path: r.path,
      title: (r.meta && r.meta.title) || r.path,
      count: (r.children || []).filter(c => !c.hidden).length,
      target: firstLeafPath(r)
    }))
)

// 菜单总数（含子级）
const menuTotal = computed(() => {
  const count = (list) => list.reduce((n, r) => n + 1 + count(r.children || []), 0)
  return count(permissionStore.sidebarRouters.filter(r => !r.hidden))
})

// 概览数据：全部来自前端真实可算数据
const stats = computed(() => [
  { label: '授权模块', value: navItems.value.length, icon: 'Menu', color: 'linear-gradient(135deg, #1e3a8a, #2563eb)' },
  { label: '可用菜单', value: menuTotal.value, icon: 'Grid', color: 'linear-gradient(135deg, #0e7490, #06b6d4)' },
  { label: '快捷入口', value: navItems.value.length, icon: 'Promotion', color: 'linear-gradient(135deg, #6d28d9, #8b5cf6)' },
  { label: '当前登录', value: username.value, icon: 'User', color: 'linear-gradient(135deg, #c2410c, #f97316)' }
])

// 快捷导航图标四色渐变循环
const palette = [
  'linear-gradient(135deg, #1e3a8a, #2563eb)',
  'linear-gradient(135deg, #0e7490, #06b6d4)',
  'linear-gradient(135deg, #6d28d9, #8b5cf6)',
  'linear-gradient(135deg, #c2410c, #f97316)'
]

const go = (path) => path && router.push(path)
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 4px;
}

// 欢迎横幅：深蓝渐变 + 光斑 + 网格 + 圆环装饰
.hero {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 55%, #3b82f6 100%);
  color: #fff;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.25);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 36px 36px;
    pointer-events: none;
  }

  .hero-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(2px);
    pointer-events: none;

    &.orb1 {
      width: 180px;
      height: 180px;
      right: 12%;
      top: -70px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.45), transparent 70%);
    }

    &.orb2 {
      width: 120px;
      height: 120px;
      left: 30%;
      bottom: -60px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.35), transparent 70%);
    }
  }

  .hero-ring {
    position: absolute;
    right: -60px;
    bottom: -90px;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.18);
    pointer-events: none;

    &::before {
      content: '';
      position: absolute;
      inset: 26px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.14);
    }

    &::after {
      content: '';
      position: absolute;
      inset: 52px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  .hero-left {
    position: relative;

    .greeting {
      font-size: 15px;
      opacity: 0.85;
      letter-spacing: 1px;
    }

    .sys-name {
      margin-top: 10px;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 4px;
    }

    .sys-en {
      margin-top: 8px;
      font-size: 11px;
      letter-spacing: 5px;
      opacity: 0.55;
    }
  }

  .hero-right {
    position: relative;
    text-align: right;

    .date {
      font-size: 16px;
      letter-spacing: 1px;
    }

    .unit {
      margin-top: 8px;
      font-size: 13px;
      opacity: 0.75;
    }
  }
}

// 数据概览
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin-top: 16px;

  .stat-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 20px;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #e4e7ed;
    transition: all 0.25s;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(30, 58, 138, 0.12);
    }

    .stat-icon {
      width: 46px;
      height: 46px;
      border-radius: 10px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-value {
      font-size: 22px;
      font-weight: 700;
      color: #1e3a8a;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .stat-label {
      margin-top: 4px;
      font-size: 12px;
      color: #909399;
    }
  }
}

.block-title {
  margin: 20px 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  padding-left: 10px;
  border-left: 3px solid #2563eb;
}

// 快捷导航
.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 14px;

  .nav-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #e4e7ed;
    cursor: pointer;
    transition: all 0.25s;

    &:hover {
      transform: translateY(-2px);
      border-color: #2563eb;
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.15);

      .nav-arrow {
        color: #2563eb;
        transform: translateX(3px);
      }
    }

    .nav-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      color: #fff;
      font-size: 18px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .nav-text {
      flex: 1;
      min-width: 0;
    }

    .nav-name {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .nav-sub {
      margin-top: 4px;
      font-size: 12px;
      color: #909399;
    }

    .nav-arrow {
      font-size: 20px;
      color: #c0c4cc;
      transition: all 0.25s;
    }
  }
}

// 底部双栏
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  .panel .block-title {
    margin-top: 16px;
  }
}

.info-card {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e4e7ed;
  padding: 6px 20px;
  height: calc(100% - 47px);
  box-sizing: border-box;

  .info-item {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #f0f2f5;
    font-size: 13px;

    &:last-child {
      border-bottom: none;
    }

    .label {
      width: 90px;
      color: #909399;
      flex-shrink: 0;
    }

    .value {
      color: #303133;
    }
  }
}

.tip-card {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e4e7ed;
  padding: 14px 20px;
  height: calc(100% - 47px);
  box-sizing: border-box;

  .tip-item {
    position: relative;
    padding: 9px 0 9px 18px;
    font-size: 13px;
    color: #606266;
    line-height: 1.7;

    &::before {
      content: '';
      position: absolute;
      left: 2px;
      top: 17px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #2563eb;
    }
  }
}
</style>
