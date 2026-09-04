<template>
  <div class="login-container">
    <!-- 左侧品牌展示区 -->
    <div class="brand-panel">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
      <div class="grid-mask"></div>

      <div class="brand-content">
        <div class="brand-logo-wrap">
          <img class="brand-logo" :src="logoImg" alt="logo" />
        </div>
        <div class="brand-title">{{ title }}</div>
        <div class="brand-divider"><span class="divider-dot"></span></div>
        <div class="brand-subtitle">数字化物资管理平台</div>
        <div class="brand-en">MATERIAL MANAGEMENT SYSTEM</div>
      </div>

      <div class="brand-copyright">© 2026 武汉武铁机辆装备有限公司</div>
    </div>

    <!-- 右侧登录表单区 -->
    <div class="login-panel">
      <div class="login-box">
        <h1 class="welcome-title">欢迎登录</h1>
        <p class="welcome-subtitle">请输入您的账号信息</p>

        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form" size="large">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="账号" clearable>
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              show-password
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="checkCode">
            <div class="check-code-row">
              <el-input v-model="loginForm.checkCode" placeholder="验证码" @keyup.enter="handleLogin" />
              <img
                class="check-code-img"
                :src="verificationCode"
                title="点击刷新验证码"
                @click="getVerificationCode"
              />
            </div>
          </el-form-item>
          <div class="login-options">
            <el-checkbox v-model="loginForm.rememberMe">记住账号</el-checkbox>
          </div>
          <el-form-item>
            <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">
              {{ loading ? '登 录 中...' : '登 录' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 初始密码/密码过期强制改密 -->
    <el-dialog v-model="updatePasswordVisible" title="修改密码" width="420px" :close-on-click-modal="false" append-to-body>
      <el-form ref="updatePwdFormRef" :model="updatePwdForm" :rules="updatePwdRules" label-width="90px">
        <el-form-item label="旧密码" prop="oldPass">
          <el-input v-model="updatePwdForm.oldPass" type="password" placeholder="请输入旧密码" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="updatePwdForm.password" type="password" placeholder="8-20位，含大小写字母、数字、特殊字符" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="updatePwdForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" :loading="updatePwdLoading" @click="handleUpdatePassword">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login, getVerificationCode as getCodeApi, changePassword } from '@/api/base/auth'
import { generateUUID } from '@/utils'
import { getCookie, setCookie, removeCookie } from '@/utils/auth'
import useUserStore from '@/store/modules/user'
import logoImg from '@/assets/logo/logo.png'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const title = import.meta.env.VITE_APP_TITLE || '物资管理信息系统'

const loginFormRef = ref(null)
const loginForm = reactive({
  username: getCookie('username') || '',
  password: '',
  checkCode: '',
  checkKey: '',
  rememberMe: true
})
const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  checkCode: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
}
const passwordType = 'password'
const loading = ref(false)
const verificationCode = ref('')

// 获取验证码
function getVerificationCode() {
  const randomKey = generateUUID(8, 16)
  loginForm.checkKey = randomKey
  getCodeApi(randomKey).then(res => {
    verificationCode.value = res.data
  })
}

// 登录
function handleLogin() {
  loginFormRef.value.validate(valid => {
    if (!valid) return
    loading.value = true
    const params = {
      username: loginForm.username,
      password: loginForm.password,
      checkCode: loginForm.checkCode,
      checkKey: loginForm.checkKey
    }
    userStore.login(params).then(res => {
      loading.value = false
      if (res.code === 0) {
        if (loginForm.rememberMe) {
          setCookie('username', loginForm.username)
        } else {
          removeCookie('username')
        }
        const redirect = route.query.redirect || '/'
        router.push(redirect)
      } else if (res.code === 10001 || res.code === 10002) {
        // 初始密码或密码过期：强制改密
        updatePwdForm.username = loginForm.username
        updatePwdForm.oldPass = loginForm.password
        updatePwdForm.pwdInitStatus = true
        updatePasswordVisible.value = true
        ElMessage.warning(res.message || '请修改密码后登录')
      } else {
        getVerificationCode()
        ElMessage.error(res.message || '登录失败')
      }
    }).catch(() => {
      loading.value = false
      getVerificationCode()
    })
  })
}

// 修改密码弹窗
const updatePasswordVisible = ref(false)
const updatePwdLoading = ref(false)
const updatePwdFormRef = ref(null)
const updatePwdForm = reactive({
  username: '',
  oldPass: '',
  password: '',
  confirmPassword: '',
  pwdInitStatus: false
})
const validateConfirm = (rule, value, callback) => {
  if (value !== updatePwdForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}
const updatePwdRules = {
  oldPass: [{ required: true, trigger: 'blur', message: '请输入旧密码' }],
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

// 提交修改密码
function handleUpdatePassword() {
  updatePwdFormRef.value.validate(valid => {
    if (!valid) return
    updatePwdLoading.value = true
    const params = {
      oldPass: updatePwdForm.oldPass,
      password: updatePwdForm.password,
      username: updatePwdForm.username,
      pwdInitStatus: updatePwdForm.pwdInitStatus
    }
    changePassword(params).then(res => {
      updatePwdLoading.value = false
      if (res.code === 0) {
        ElMessage.success('密码修改成功，请重新登录')
        updatePasswordVisible.value = false
        // 清理登录态并刷新验证码
        userStore.token = ''
        getVerificationCode()
        loginForm.password = ''
        loginForm.checkCode = ''
      } else {
        ElMessage.error(res.message || '修改密码失败')
      }
    }).catch(() => {
      updatePwdLoading.value = false
    })
  })
}

getVerificationCode()
</script>

<style lang="scss" scoped>
$brand-1: #0a1f3d;
$brand-2: #1e3a8a;
$brand-3: #2563eb;
$brand-4: #1d4ed8;
// 品牌区背景专用渐变（调亮一档；不改变 $brand-*，避免影响登录按钮与输入框用色）
$brand-bg-1: #12305e;
$brand-bg-2: #2a4db0;
$brand-bg-3: #3b82f6;
$text-primary: #1f2937;
$text-secondary: #6b7280;

.login-container {
  position: relative;
  display: flex;
  height: 100%;
  background: #f5f7fb;
  overflow: hidden;

  /* ============ 左侧品牌区 ============ */
  .brand-panel {
    position: relative;
    width: 58%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: linear-gradient(135deg, $brand-bg-1 0%, $brand-bg-2 55%, $brand-bg-3 100%);

    // 漂浮光斑（低饱和，安静）
    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(70px);
      opacity: 0.35;
      animation: float-blob 18s ease-in-out infinite;
      pointer-events: none;
    }
    .blob-1 {
      width: 460px;
      height: 460px;
      top: -120px;
      left: -100px;
      background: rgba(96, 165, 250, 0.55);
    }
    .blob-2 {
      width: 380px;
      height: 380px;
      bottom: -100px;
      right: -80px;
      background: rgba(56, 189, 248, 0.45);
      animation-delay: -6s;
    }
    .blob-3 {
      width: 260px;
      height: 260px;
      top: 45%;
      left: 55%;
      // 淡红光斑，蓝底中透暖色，与红徽呼应
      background: rgba(239, 68, 68, 0.35);
      animation-delay: -12s;
    }

    // 网格底纹
    .grid-mask {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 44px 44px;
      opacity: 0.5;
    }

    .brand-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 0 40px;

      .brand-logo-wrap {
        width: 116px;
        height: 116px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.25);
        // 外发光 + 内高光，强化视觉中心
        box-shadow:
          0 0 40px rgba(255, 255, 255, 0.18),
          0 8px 30px rgba(0, 0, 0, 0.25),
          inset 0 1px 0 rgba(255, 255, 255, 0.25);
        margin-bottom: 32px;

        .brand-logo {
          width: 76px;
          height: 76px;
          object-fit: contain;
        }
      }

      .brand-title {
        color: #fff;
        font-size: 34px;
        font-weight: 700;
        letter-spacing: 8px;
        white-space: nowrap;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }

      // 精致分隔线：细线 + 中心菱形点
      .brand-divider {
        position: relative;
        width: 120px;
        height: 1px;
        margin: 24px auto 20px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);

        .divider-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 6px;
          height: 6px;
          background: #fff;
          transform: translate(-50%, -50%) rotate(45deg);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
        }
      }

      .brand-subtitle {
        color: rgba(255, 255, 255, 0.85);
        font-size: 16px;
        letter-spacing: 4px;
      }

      .brand-en {
        margin-top: 12px;
        color: rgba(255, 255, 255, 0.55);
        font-size: 10px;
        letter-spacing: 6px;
        text-transform: uppercase;
      }
    }

    .brand-copyright {
      position: absolute;
      bottom: 28px;
      left: 0;
      right: 0;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      letter-spacing: 1px;
    }
  }

  /* ============ 右侧表单区 ============ */
  .login-panel {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: #fff;
  }

  .login-box {
    width: 100%;
    max-width: 400px;

    .welcome-title {
      margin: 0;
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      color: $text-primary;
      letter-spacing: 1px;
    }

    .welcome-subtitle {
      margin: 10px 0 32px;
      text-align: center;
      font-size: 13px;
      color: $text-secondary;
    }

    // 输入框定制（与图形验证码高度一致 52px；项目 Element Plus 命名空间为 ep）
    // 全局样式对 .ep-input__wrapper 有 28px !important 统一限制，此处需 !important 覆盖
    :deep(.ep-input__wrapper) {
      height: 52px !important;
      line-height: 52px !important;
      min-height: 52px !important;
      border-radius: 8px;
      box-shadow: 0 0 0 1px #d6dae2 inset;
      transition: box-shadow 0.2s, background-color 0.2s;

      &:hover {
        box-shadow: 0 0 0 1px #b6bcc9 inset;
      }

      &.is-focus {
        box-shadow:
          0 0 0 1px $brand-3 inset,
          0 0 0 4px rgba(37, 99, 235, 0.12);
      }
    }

    :deep(.ep-input__inner) {
      height: 52px !important;
    }

    :deep(.ep-input__prefix) {
      color: #98a2b3;
    }

    :deep(.ep-form-item__error) {
      padding-top: 4px;
    }

    .check-code-row {
      display: flex;
      gap: 10px;
      width: 100%;

      .check-code-img {
        width: 130px;
        height: 52px;
        cursor: pointer;
        border: 1px solid #dcdfe6;
        border-radius: 8px;
        flex-shrink: 0;
      }
    }

    .login-options {
      display: flex;
      justify-content: flex-start;
      margin: -6px 0 4px;

      :deep(.ep-checkbox__label) {
        font-size: 13px;
        color: $text-secondary;
      }
    }

    .login-btn {
      width: 100%;
      height: 52px;
      border-radius: 8px;
      font-size: 16px;
      letter-spacing: 8px;
      border: none;
      background: linear-gradient(135deg, $brand-3, $brand-4);
      transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
        filter: brightness(1.05);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

// 光斑漂流动效
@keyframes float-blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(36px, -24px) scale(1.08);
  }
}

// 响应式：窄屏隐藏品牌区，回退为居中卡片
@media (max-width: 900px) {
  .login-container {
    background: linear-gradient(135deg, $brand-bg-1 0%, $brand-bg-2 55%, $brand-bg-3 100%);

    .brand-panel {
      display: none;
    }

    .login-panel {
      background: rgba(255, 255, 255, 0.92);
      margin: 24px;
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
      padding: 32px;
    }
  }
}
</style>
