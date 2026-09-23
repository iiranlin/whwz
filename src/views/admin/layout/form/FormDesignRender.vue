<template>
  <component ref="formRef" :is="config.name" :mode="mode" v-model="_value" v-bind="config.props"/>
</template>
<script setup name="FormRender">
import { ref, computed } from 'vue'
import components from '@/views/common/form/ComponentExport'

const props = defineProps({
  mode: {
    type: String,
    default: 'DESIGN'
  },
  modelValue: {
    default: undefined
  },
  config: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const emit = defineEmits(['update:modelValue'])

const formRef = ref(null)

const _value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function validate(call) {
  formRef.value.validate(call)
}
</script>

<style lang="scss" scoped>

</style>
