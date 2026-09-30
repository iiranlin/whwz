<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-input size="medium" disabled :placeholder="placeholder" show-word-limit :rows="2" type="textarea" />
    </div>
    <div v-else>
      <el-input v-if="!readerMode" size="medium" v-model="_value" clearable :maxlength="255" :placeholder="placeholder" show-word-limit :rows="3" type="textarea" />
      <div v-else v-text="_value"></div>

    </div>
  </div>
</template>

<script setup name="TextareaInput">
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: String,
    default: null
  },
  placeholder: {
    type: String,
    default: '请输入内容'
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
