<template>
  <div>
    <div class="header">
      <el-menu :default-active="modelValue" active-text-color="#409eff" class="el-menu-demo" mode="horizontal">
        <!-- <el-menu-item index="baseSetting" @click="to('baseSetting')">① 基础信息</el-menu-item> -->
        <!-- <el-menu-item index="formSetting" @click="to('formSetting')">② 审批表单</el-menu-item> -->
        <!-- <el-menu-item index="processDesign" @click="to('processDesign')"> -->
        <el-menu-item index="processDesign">
          <!-- ③  -->
          审批流程
        </el-menu-item>
        <!-- <el-menu-item index="proSetting" @click="to('proSetting')">④ 扩展设置</el-menu-item> -->
      </el-menu>
      <div class="publish">
        <el-button size="mini" @click="preview"><i class="el-icon-view"></i>预览</el-button>
        <el-button size="mini" type="primary" @click="publish"><i class="el-icon-s-promotion"></i>发布</el-button>
      </div>
      <div class="back">
        <el-button @click="exit" size="medium" icon="el-icon-arrow-left" circle></el-button>
        <span style="paddingLeft: 10px">
          <!-- <i :class="" :style="'background:' + setup.logo.background"></i> -->
          <span>{{ route.query.modelName }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup name="LayoutHeader">
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useProcessStore } from '@/store/modules/process'

const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const processStore = useProcessStore()

const props = defineProps({
  modelValue: {
    type: String,
    default: 'baseSetup'
  }
})

const emit = defineEmits(['update:modelValue', 'publish', 'preview'])

const viewCode = ref(false)

const setup = computed(() => processStore.design)

// created
console.log('setup', setup.value)
check()

onMounted(() => {
  console.log(document.body.offsetWidth)
  if (document.body.offsetWidth <= 970) {
    proxy.$msgbox.alert("本设计器未适配中小屏幕，建议您在PC电脑端浏览器进行操作")
  }
  listener()
})

function publish() {
  emit('publish')
}

function preview() {
  emit('preview')
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
  router.push({ name: 'processDesign' })
}

function to(path) {
  emit('update:modelValue', path)
}

function handleSelect(key, keyPath) {
  console.log(key, keyPath)
}

function listener() {
  window.onunload = closeBefore()
  window.onbeforeunload = closeBefore()
}

function closeBefore() {
  return false
}

function check() {
  if (processStore.isEdit === null) {
    //this.$router.push("/workPanel");
  }
}
</script>
<style lang="scss" scoped>

:deep(.header) {

  // min-width: 980px;
  // position: relative;
  width: 100%;
  // min-width: 980px;
  position: absolute;

  .el-menu {
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
