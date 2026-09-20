<template>
  <div class="navbar">
    <div class="navbar-breadcrumb">
      <Breadcrumb class="breadcrumb-container" />
    </div>
    <div class="navbar-right">
      <span class="navbar-login-date" v-if="loginDate">
        登录日期：
        <el-date-picker
          v-model="selectedDate"
          class="navbar-date-picker"
          type="date"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          placeholder="请选择"
          :clearable="false"
          :disabled-date="disabledDate"
          @visible-change="loadAvailableMonths"
          @change="onDateChange"
        />
      </span>
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="navbar-user">
          <span class="navbar-avatar" :class="{ 'is-long': avatarChar.length > 1 }">{{ avatarChar }}</span>
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
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'
import { getCcrecordYear, getMonthCloseList } from '@/api/settlementFile/monthCloseGroup'
import { setCookie, getCookie } from '@/utils/auth'
import Breadcrumb from '@/components/Breadcrumb/index.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 当前选中登录日期（格式 YYYY-MM-DD）
const selectedDate = ref('')
// 可选月份集合（本单位开账中 closeFlag=0 的月份，格式 yyyyMM）
const availableMonths = ref(new Set())
// 开账月列表（按年月倒序，用于回退取最近开账月）
const openMonths = ref([])
const loginDate = computed(() => selectedDate.value)

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
function yearMonthOf(dateStr) {
  return dateStr.replace(/-/g, '').substring(0, 6)
}
// 计算指定年月（yyyyMM）的最后一天，格式 yyyy-MM-dd
function lastDayOfMonth(yearMonth) {
  const y = parseInt(yearMonth.substring(0, 4), 10)
  const m = parseInt(yearMonth.substring(4, 6), 10)
  const lastDay = new Date(y, m, 0)
  return `${yearMonth.substring(0, 4)}-${String(m).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`
}
// 写入登录日期相关 cookie（供全局请求拦截器注入 loginDate/yearMonth）
function writeDateCookies(dateStr) {
  setCookie('warehouseYearMonth', dateStr)
  setCookie('warehouseGetYear', JSON.stringify({ yearMonth: yearMonthOf(dateStr) }))
}

// 加载本单位全部封账记录，构建开账月集合（yearMonth 显式传空绕过拦截器注入取全量）
function loadAvailableMonths() {
  if (openMonths.value.length > 0) return Promise.resolve()
  return getMonthCloseList({ pageNum: 1, pageSize: 1000, yearMonth: '' }).then(({ data }) => {
    const set = new Set()
    const months = []
    ;(data.list || []).forEach(row => {
      if (row.closeFlag === '0' && row.yearMonth) {
        set.add(row.yearMonth)
        months.push(row.yearMonth)
      }
    })
    availableMonths.value = set
    openMonths.value = months.sort().reverse()
  }).catch(() => {})
}
// 初始化：先查封账记录校验缓存日期所在月是否仍开账
// 1) 缓存日期所在月仍开账 → 保留；2) 否则回退最近开账月月末；3) 无开账月 → 今天/接口兜底
function loadLoginDate() {
  const cachedDate = getCookie('warehouseYearMonth')
  loadAvailableMonths().then(() => {
    if (cachedDate && (availableMonths.value.size === 0 || availableMonths.value.has(yearMonthOf(cachedDate)))) {
      selectedDate.value = cachedDate
      writeDateCookies(cachedDate)
      return
    }
    if (openMonths.value.length > 0) {
      // 回退：今天在开账月内用今天，否则用最近开账月月末
      const today = formatDate(new Date())
      const fallback = availableMonths.value.has(yearMonthOf(today)) ? today : lastDayOfMonth(openMonths.value[0])
      selectedDate.value = fallback
      writeDateCookies(fallback)
      return
    }
    // 无封账记录：接口兜底
    getCcrecordYear().then(({ data }) => {
      const yearMonth = data && data.yearMonth
      const fallback = yearMonth ? lastDayOfMonth(yearMonth) : formatDate(new Date())
      selectedDate.value = fallback
      writeDateCookies(fallback)
    }).catch(() => {
      const now = formatDate(new Date())
      selectedDate.value = now
    })
  })
}
// 非开账月的日期禁选；未加载到封账记录时全部放开避免锁死
function disabledDate(date) {
  if (availableMonths.value.size === 0) return false
  const ym = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`
  return !availableMonths.value.has(ym)
}
// 切换日期：更新 cookie 后刷新页面，使全部业务按新登录日期处理
function onDateChange(val) {
  if (!val) return
  writeDateCookies(val)
  location.reload()
}
onMounted(() => {
  loadLoginDate()
})

const username = computed(() => userStore.userInfo.username || userStore.userInfo.nickName || '用户')
// 头像首字：优先取昵称首字
const avatarChar = computed(() => {
  const name = userStore.userInfo.nickName || userStore.userInfo.username || '用'
  // return name.charAt(0).toUpperCase()
  return name.toUpperCase()
})

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
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;

  .navbar-breadcrumb {
    float: left;
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 12px;

    .navbar-login-date {
      display: inline-flex;
      align-items: center;
      font-size: 13px;
      color: #606266;
      white-space: nowrap;

      .navbar-date-picker {
        width: 125px;
        margin-left: 4px;

        :deep(.el-input__wrapper) {
          box-shadow: none;
          background: transparent;
          padding: 0 4px;
        }

        :deep(.el-input__inner) {
          color: #2563eb;
          font-size: 13px;
          cursor: pointer;
        }

        :deep(.el-input__suffix) {
          display: none;
        }
      }
    }

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
        white-space: nowrap;

        &.is-long {
          width: auto;
          padding: 0 10px;
          border-radius: 14px;
          font-size: 12px;
        }
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
