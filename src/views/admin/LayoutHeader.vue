<template>
  <div>
    <div class="header">
      <el-menu :default-active="value" active-text-color="#409eff" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="processDesign">
          审批流程
        </el-menu-item>
      </el-menu>
      <div class="publish">
        <el-button size="mini" @click="preview"><el-icon><View /></el-icon>预览</el-button>
        <el-button size="mini" type="primary" @click="publish"><el-icon><Promotion /></el-icon>发布</el-button>
      </div>
      <div class="back">
        <el-button @click="exit" size="medium" :icon="ArrowLeft" circle></el-button>
        <span style="paddingLeft: 10px">
          <!-- <i :class="" :style="'background:' + setup.logo.background"></i> -->
          <span>{{ route.query.modelName }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup name="LayoutHeader">
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useProcessStore } from '@/store/modules/process'

const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const processStore = useProcessStore()

const props = defineProps({
  value: {
    type: String,
    default: 'baseSetup'
  }
})

const emit = defineEmits(['publish', 'preview', 'input'])

const viewCode = ref(false)

const setup = computed(() => processStore.design)

// created 钩子逻辑
console.log('setup', setup.value)
check()

// mounted 钩子逻辑
onMounted(() => {
  console.log(document.body.offsetWidth)
  if (document.body.offsetWidth <= 970) {
    ElMessageBox.alert("本设计器未适配中小屏幕，建议您在PC电脑端浏览器进行操作")
  }
  listener()
})

function publish() {
  emit('publish')
}

function preview() {
  emit('preview')
  //this.
  viewCode.value = true
}

function valid() {
  if (!proxy.$isNotEmpty(setup.value.group)) {
    ElMessage.warning('请选择分组')
    router.push('/layout/baseSetup')
    return false
  }
  return true
}

function exit() {
  // this.$confirm('未发布的内容将不会被保存，是否直接退出 ?', '提示', {
  //   confirmButtonText: '退出',
  //   cancelButtonText: '取消',
  //   type: 'warning'
  // }).then(() => {
    //window.location.reload()
    //this.$store.commit('clearTemplate')
  //   router.go(-1)
  // })
  // 判断是否为单开页签
  // this.cancelRouterSkip();
  router.push({ name: 'processDesign' })
}

function to(path) {
  emit('input', path)
}

function handleSelect(key, keyPath) {
  console.log(key, keyPath)
}

function listener() {
  window.onunload = closeBefore()
  window.onbeforeunload = closeBefore()
  //window.on('beforeunload',this.closeBefore())
}

function closeBefore() {
  //alert("您将要离开本页")
  return false
}

function check() {
  if (processStore.isEdit === null) {
    //router.push("/workPanel");
  }
}
</script>

<style lang="scss" scoped>
:deep(.header .ep-menu--horizontal .ep-menu-item) {
      color: #409eff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 2px solid #409eff !important;
}
:deep(.header) {

  // min-width: 980px;
  // position: relative;
  width: 100%;
  // min-width: 980px;
  position: absolute;

  .el-menu-demo {
    top: 0;
    z-index: 999;
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .publish {
    position: absolute;
    top: 15px;
    right: 20px;
    z-index: 1000;

    i {
      margin-right: 6px;
    }

    button {
      border-radius: 15px;
      margin-right: 10px;
    }
  }

  .back {
    position: absolute;
    z-index: 1000;
    top: 10px;
    left: 20px;
    font-size: small;

    span {
      i {
        border-radius: 10px;
        padding: 7.8px;
        font-size: 20px;
        color: #ffffff;
        margin: 0 10px;
      }
    }

  }
}
</style>
