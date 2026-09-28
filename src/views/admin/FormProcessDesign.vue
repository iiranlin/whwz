<template>
  <div class="form-process-design" :key="key">
    <el-header style="background: white">
      <layout-header
        v-model="activeSelect"
        @publish="publishProcess"
        @preview="preview"
      ></layout-header>
    </el-header>
    <div class="layout-body">
      <process-design
        ref="processDesignRef"
        v-show="activeSelect === 'processDesign'"
      />
    </div>
    <w-dialog
      :showFooter="false"
      v-model="validVisible"
      title="设置项检查"
    >
      <el-steps
        align-center
        :active="validStep"
        finish-status="success"
      >
        <el-step
          v-for="(step, i) in validOptions"
          :title="step.title"
          :key="i"
          :icon="step.icon"
          :status="step.status"
          :description="step.description"
        />
      </el-steps>
      <el-result
        :icon="validIcon"
        :title="errTitle"
        :sub-title="validResult.desc"
      >
        <i
          slot="icon"
          style="font-size: 30px"
          v-if="!validResult.finished"
          class="el-icon-loading"
        ></i>
        <div
          slot="subTitle"
          class="err-info"
          v-if="validResult.errs.length > 0"
        >
          <ellipsis
            hover-tip
            v-for="(err, i) in validResult.errs"
            :key="i + '_err'"
            :content="err"
          >
            <i
              slot="pre"
              class="el-icon-warning-outline"
            ></i>
          </ellipsis>
        </div>
        <template slot="extra">
          <el-button
            type="primary"
            v-if="validResult.finished"
            size="medium"
            @click="doAfter"
          >
            {{ validResult.action }}
          </el-button>
        </template>
      </el-result>
    </w-dialog>
  </div>

</template>

<script setup name="FormProcessDesign">
import { ref, computed, onMounted, onActivated, onBeforeUnmount, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { getFiledByType as getFiledByTypeApi } from '@/api/workflow/category'
import LayoutHeader from './LayoutHeader'
import ProcessDesign from '@/views/admin/layout/ProcessDesign'
import { getFormDetailByModelId, saveFormDetailByMode } from '@/api/design'
import { useProcessStore } from '@/store/modules/process'
import { isNotEmpty } from '@/utils/process'

const { proxy } = getCurrentInstance()
const processStore = useProcessStore()
const router = useRouter()
const route = useRoute()

const key = ref('1')
const isNew = ref(true)
const activeSelect = ref('processDesign')
const validVisible = ref(false)
const validStep = ref(0)
const timer = ref(null)
const formItems = ref([])
const processDesignRef = ref(null)

const validResult = ref({})
const validOptions = ref([
  { title: '审核流程', description: '', icon: '', status: '' },
])
const validComponents = [
  'processDesign',
]

const setup = computed(() => processStore.design)

const errTitle = computed(() => {
  if (validResult.value.finished && !validResult.value.success) {
    return validResult.value.title + ` (${validResult.value.errs.length}项错误) `
  }
  return validResult.value.title
})

const validIcon = computed(() => {
  if (!validResult.value.finished) {
    return 'el-icon-loading'
  } else if (validResult.value.success) {
    return 'success'
  } else {
    return 'warning'
  }
})

// 初始化逻辑抽出，onMounted 和 onActivated 都调用，标志位防重复
let inited = false
function init() {
  if (inited) return
  inited = true
  console.log('FormProcessDesign init 执行')
  showValiding()
  const code = route.query.code
  const isUpdate = route.query.isUpdate
  key.value = route.query.id
  getFiledByType()
  loadInitFrom()
  if (isUpdate) {
    isNew.value = false
    loadFormInfo(code)
  }
  const group = route.query.group
  processStore.groupId = isNotEmpty(group) ? parseInt(group) : null
}

onMounted(() => {
  console.log('FormProcessDesign onMounted 触发')
  init()
})

onActivated(() => {
  console.log('FormProcessDesign onActivated 触发')
  init()
})

onBeforeUnmount(() => {
  stopTimer()
})

function loadFormInfo(formId) {
  getFormDetailByModelId(formId).then(rsp => {
    const form = rsp.data || {}
    form.formItems = formItems.value
    form.process = JSON.parse(form.process)
    processStore.loadForm(form)
  }).catch(err => {
    ElMessage.error(err)
  })
}

async function getFiledByType() {
  const params = {
    type: route.query.billType
  }
  const loading = ElLoading.service({ lock: true, text: '加载中...' })
  try {
    console.log(params, '1111111111111')

    // const res = await getFiledByTypeApi(params)
    const res = {
      "code": 0,
      "message": "操作成功",
      "data": [
        {
          "id": "materialClassify",
          "title": "物资分类",
          "name": "TextInput",
          "valueType": "String",
          "dictFlag": false,
          "props": {
            "enablePrint": true,
            "required": true
          },
          "dictMap": {}
        },
        {
          "id": "isExpertAudit",
          "title": "是否需要专家审核",
          "name": "TextInput",
          "valueType": "String",
          "dictFlag": true,
          "props": {
            "enablePrint": true,
            "required": true
          },
          "dictMap": {
            "0": "否",
            "1": "是"
          }
        }
      ]
    }
    if (res.code == 0) {
      formItems.value = res.data || []
    } else {
      proxy.$modal.msgError(res?.message || '请求失败')
    }
  } catch (e) {
    console.error('getFiledByType', e)
  } finally {
    loading.close()
  }
}

function loadInitFrom() {
  console.log('loadInitFrom 执行，准备写入 process')
  processStore.loadForm({
    formId: null,
    formName: "未命名表单",
    logo: {
      icon: "el-icon-eleme",
      background: "#1e90ff"
    },
    settings: {
      commiter: [],
      admin: [],
      sign: false,
      notify: {
        types: ["APP"],
        title: "消息通知标题"
      }
    },
    groupId: undefined,
    formItems: formItems.value,
    process: {
      id: "root",
      parentId: null,
      type: "ROOT",
      name: "发起人",
      desc: "任何人",
      props: {
        assignedUser: [],
        formPerms: []
      },
      children: {}
    },
    remark: "备注说明"
  })
  console.log('loadForm 后 processStore.design =', processStore.design)
}

function validateDesign() {
  validVisible.value = true
  validStep.value = 0
  showValiding()
  stopTimer()
  timer.value = setInterval(() => {
    const errs = processDesignRef.value?.validate?.() || []
    if (Array.isArray(errs) && errs.length === 0) {
      validStep.value++
      if (validStep.value >= validOptions.value.length) {
        stopTimer()
        showValidFinish(true)
      }
    } else {
      stopTimer()
      validOptions.value[validStep.value].status = 'error'
      validResult.value.errs = errs
      showValidFinish(false, getDefaultValidErr())
    }
  }, 300)
}

function getDefaultValidErr() {
  switch (validStep.value) {
    case 0:
      return '请检查基础设置项'
    case 1:
      return '请检查审批表单相关设置'
    case 2:
      return '请检查审批流程，查看对应标注节点错误信息'
    case 3:
      return '请检查扩展设置'
    default:
      return '未知错误'
  }
}

function showValidFinish(success, err) {
  validResult.value.success = success
  validResult.value.finished = true
  validResult.value.title = success ? '校验完成 ' : '校验失败 '
  validResult.value.desc = success ? '设置项校验成功，是否发布流程？' : err
  validResult.value.action = success ? '发布' : '去修改'
}

function showValiding() {
  validResult.value = {
    errs: [],
    finished: false,
    success: false,
    title: '检查中...',
    action: '处理',
    desc: '正在检查设置项'
  }
  validStep.value = 0
  validOptions.value.forEach(op => {
    op.status = ''
    op.icon = ''
    op.description = ''
  })
}

function doAfter() {
  if (validResult.value.success) {
    doPublish()
  } else {
    activeSelect.value = validComponents[validStep.value]
    validVisible.value = false
  }
}

function stopTimer() {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

function preview() {
  validateDesign()
}

function publishProcess() {
  validateDesign()
}

async function doPublish() {
  try {
    await ElMessageBox.confirm('如果您只想预览请选择预览，确认发布后流程立即生效，是否继续?', '提示', {
      confirmButtonText: '发布',
      cancelButtonText: '取消',
      type: 'warning'
    })
    console.log(setup.value)
    const template = {
      process: JSON.stringify(setup.value.process),
      formItems: JSON.stringify(setup.value.formItems),
      modelId: route.query.code,
      modelName: route.query.modelName,
      modelKey: route.query.modelKey,
      category: route.query.category,
      billType: route.query.billType,
    }
    const rsp = await saveFormDetailByMode(template)
    if (rsp.code != 0) {
      throw new Error(rsp?.message || '发布失败')
    }
    ElMessage.success("流程发布成功")
    validVisible.value = false
    router.push({ name: 'processDesign' })
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error(e?.message || e)
    }
    console.log("doPublish error:", e)
  }
}
</script>
<style lang="scss" >
.form-process-design {
  background-color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
}
.design {
  div {
    box-sizing: content-box;
  }
  .btn {
    margin: 0;
  }
}
</style>
<style lang="scss" scoped>
.layout-body {
  min-width: 980px;
  height: calc(100vh - 65px);
  overflow: scroll;
}

:deep(.el-step) {
  .is-success {
    color: #2a99ff;
    border-color: #2a99ff;
  }
}

.err-info {
  max-height: 180px;
  & > div {
    padding: 5px;
    margin: 2px 0;
    width: 220px;
    text-align: left;
    border-radius: 3px;
    background: rgb(242, 242, 242);
  }
  i {
    margin: 0 5px;
  }
}

::-webkit-scrollbar {
  width: 2px;
  height: 2px;
  background-color: white;
}

::-webkit-scrollbar-thumb {
  border-radius: 16px;
  background-color: #e8e8e8;
}
</style>