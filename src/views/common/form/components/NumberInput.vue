<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-input size="medium" disabled :placeholder="placeholder" type="number"/>
    </div>
    <div v-else>
      <el-input v-if="!readerMode" v-model="_value" size="medium" clearable :placeholder="placeholder" type="number"/>
      <div v-else v-text="_value"></div>
    </div>
  </div>
</template>

<script setup name="NumberInput">
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    default: null
  },
  placeholder: {
    type: String,
    default: '请输入数值'
  },
  readerMode: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: 'DESIGN'
  },
  required: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['input'])

const _value = computed({
  get() { return props.value },
  set(v) { emit('input', v) }
})
</script>

<style scoped>

</style>
