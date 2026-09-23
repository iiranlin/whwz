<template>
  <el-main>
    <div class="scale">
      <el-button icon="el-icon-plus" size="small" @click="scale += 10" :disabled="scale >= 150" circle></el-button>
      <span>{{ scale }}%</span>
      <el-button icon="el-icon-minus" size="small" @click="scale -= 10" :disabled="scale <= 40" circle></el-button>
    </div>
    <div class="design" :style="'transform: scale('+ scale / 100 +');'">
      <process-tree-viewer ref="processTree" @selectedNode="nodeSelected"/>
    </div>
  </el-main>
</template>

<script setup name="ProcessDiagramViewer">
import NodeConfig from '../../common/process/config/NodeConfig'
import ProcessTreeViewer from "@/views/admin/layout/process/ProcessTreeViewer";

const processStore = useProcessStore()

const processTree = ref(null)
const scale = ref(100)
const selected = ref({})
const showInput = ref(false)
const showConfig = ref(false)

const selectedNode = computed(() => processStore.selectedNode)

// created
processStore.diagramMode = 'viewer'

onBeforeUnmount(() => {
  processStore.diagramMode = 'design'
})

function validate() {
  return processTree.value.validateProcess()
}
function nodeSelected(node) {
  console.log('配置节点', node)
  showConfig.value = true
}
</script>

<style lang="scss" scoped>
.design {
  margin-top: 100px;
  display: flex;
  transform-origin: 50% 0px 0px;
}

.scale {
  z-index: 999;
  position: fixed;
  top: 80px;
  right: 40px;

  span {
    margin: 0 10px;
    font-size: 15px;
    color: #7a7a7a;
    width: 50px;
  }
}

.node-config-content{
  padding: 0 20px 20px;
}

:deep(.el-drawer__body){
  overflow-y: auto;
}
</style>
