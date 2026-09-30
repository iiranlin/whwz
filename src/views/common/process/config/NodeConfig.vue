<template>
  <div>
    <el-tabs v-model="active" v-if="name && formConfig.length > 0">
      <el-tab-pane :label="name" name="properties">
        <component :is="currentComponent" :config="selectNode.props"/>
      </el-tab-pane>
      <!-- <el-tab-pane label="表单权限设置" name="permissions">
        <form-authority-config/>
      </el-tab-pane> -->
    </el-tabs>
    <component :is="currentComponent" v-else :config="selectNode.props"/>
  </div>
</template>

<script setup name="NodeConfig">
import { ref, computed } from 'vue'
import { useProcessStore } from '@/store/modules/process'
import Approval from './ApprovalNodeConfig.vue'
import Condition from './ConditionNodeConfig.vue'
import Delay from './DelayNodeConfig.vue'
import Cc from './CcNodeConfig.vue'
import Trigger from './TriggerNodeConfig.vue'
import FormAuthorityConfig from './FormAuthorityConfig.vue'
import Root from './RootNodeConfig.vue'

const processStore = useProcessStore()

const active = ref('properties')

const selectNode = computed(() => processStore.selectedNode)
const formConfig = computed(() => processStore.design.formItems)
const name = computed(() => {
  switch (selectNode.value?.type) {
    case 'ROOT':
      return '设置发起人'
    case 'APPROVAL':
      return '设置审批人'
    case 'CC':
      return '设置抄送人'
    default:
      return null
  }
})

// 节点类型 -> 配置组件 映射表
// 修复：原来用 (type||'').toLowerCase() 传字符串，Vue 3 会当成原生标签 <approval> 渲染，导致空白
const CONFIG_COMPONENT_MAP = {
  ROOT: Root,
  APPROVAL: Approval,
  CC: Cc,
  DELAY: Delay,
  TRIGGER: Trigger,
  CONDITION: Condition,
  // 分支容器（一般不会走到，兜底）
  CONDITIONS: Condition,
  CONCURRENTS: Condition,
  CONCURRENT: Condition,
  EMPTY: null,
}

const currentComponent = computed(() => {
  const type = selectNode.value?.type
  if (!type) return null
  const comp = CONFIG_COMPONENT_MAP[type]
  if (!comp) {
    console.warn('[NodeConfig] 未匹配到配置组件, type =', type)
  }
  return comp
})
</script>

<style lang="scss" scoped>

</style>