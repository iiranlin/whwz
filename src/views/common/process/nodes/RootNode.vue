<template>
  <node title="发起人" :is-root="true" :content="content"
        @selected="$emit('selected')" @insertNode="type => $emit('insertNode', type)"
        placeholder="所有人" :header-bgc="headerBgc" header-icon="el-icon-user-solid"/>
</template>

<script setup name="RootNode">
import { computed } from 'vue'
import Node from './Node'
import { useProcessStore } from '@/store/modules/process'

const processStore = useProcessStore()

const props = defineProps({
  config: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
defineEmits(['selected', 'insertNode'])

const content = computed(() => {
  if (props.config.props.assignedUser.length > 0) {
    let texts = []
    props.config.props.assignedUser.forEach(org => texts.push(org.name))
    return String(texts).replaceAll(',', '、')
  } else {
    return '所有人'
  }
})

const headerBgc = computed(() => {
  if (processStore.diagramMode === 'viewer') {
    return props.config.props.headerBgc
  } else {
    return '#576a95'
  }
})
</script>

<style scoped>

</style>
