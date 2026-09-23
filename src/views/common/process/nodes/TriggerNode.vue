<template>
  <node :title="config.name" :show-error="showError" :content="content" :error-info="errorInfo"
        @selected="$emit('selected')" @delNode="$emit('delNode')" @insertNode="type => $emit('insertNode', type)"
        placeholder="请设置触发器" header-bgc="#47bc82" header-icon="el-icon-set-up"/>
</template>

<script setup name="TriggerNode">
import { ref, computed, getCurrentInstance } from 'vue'
import Node from './Node'

const { proxy } = getCurrentInstance()

const props = defineProps({
  config: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
defineEmits(['selected', 'delNode', 'insertNode'])

const showError = ref(false)
const errorInfo = ref('')

const content = computed(() => {
  props.config
})

//校验数据配置的合法性
function validate(err) {
  showError.value = false
  if (props.config.props.type === 'WEBHOOK') {
    if (proxy.$isNotEmpty(props.config.props.http.url)) {
      showError.value = false
    } else {
      showError.value = true
      errorInfo.value = '请设置WEBHOOK的URL地址'
    }
  } else if (props.config.props.type === 'EMAIL') {
    if (!proxy.$isNotEmpty(props.config.props.email.subject)
        || props.config.props.email.to.length === 0
        || !proxy.$isNotEmpty(props.config.props.email.content)) {
      showError.value = true
      errorInfo.value = '请设置邮件发送配置'
    } else {
      showError.value = false
    }
  }
  if (showError.value) {
    err.push(`${props.config.name} 触发动作未设置完善`)
  }
  return !showError.value
}
</script>

<style scoped>

</style>
