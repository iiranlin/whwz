<template>
  <el-main>
    <div class="scale">
      <el-button
        icon="el-icon-plus"
        size="small"
        @click="scale += 10"
        :disabled="scale >= 150"
        circle
      ></el-button>
      <span>{{ scale }}%</span>
      <el-button
        icon="el-icon-minus"
        size="small"
        @click="scale -= 10"
        :disabled="scale <= 40"
        circle
      ></el-button>
      <!--      <el-button @click="validate">校验流程</el-button>-->
    </div>
    <div
      class="design"
      :style="'transform: scale('+ scale / 100 +');'"
    >
      <process-tree
        ref="processTree"
        @selectedNode="nodeSelected"
      />
    </div>
    <el-drawer
      :title="selectedNode.name"
      v-model:visible="showConfig"
      :modal-append-to-body="false"
      :size="selectedNode.type === 'CONDITION' ? '600px':'500px'"
      direction="rtl"
      :modal="false"
      destroy-on-close
    >
      <template #title>
        <div>
        <el-input
          v-model="selectedNode.name"
          size="medium"
          v-show="showInput"
          style="width: 300px"
          @blur="showInput = false"
        ></el-input>
        <el-link
          v-show="!showInput"
          @click="showInput = true"
          style="font-size: medium"
        >
          <i
            class="el-icon-edit"
            style="margin-right: 10px"
          ></i>
          {{selectedNode.name}}
        </el-link>
        </div>
      </template>
      <div class="node-config-content">
        <node-config />
      </div>
    </el-drawer>
  </el-main>
</template>

<script setup name="ProcessDesign">
import ProcessTree from './process/ProcessTree.vue'
import NodeConfig from '../../common/process/config/NodeConfig'

const processStore = useProcessStore()

const processTree = ref(null)
const scale = ref(100)
const selected = ref({})
const showInput = ref(false)
const showConfig = ref(false)

const selectedNode = computed(() => processStore.selectedNode)

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
  // margin-top: 100px;
  display: flex;
  transform-origin: 50% 0px 0px;
  margin-top: 60px;
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

.node-config-content {
  padding: 0 20px 20px;
}

// ::v-deep .el-drawer__body {
//   overflow-y: auto;
// }
</style>
