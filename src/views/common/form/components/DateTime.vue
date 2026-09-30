<template>
  <div>
    <div v-if="mode === 'DESIGN'" >
      <el-date-picker size="medium" disabled :type="type" :placeholder="placeholder"></el-date-picker>
    </div>
    <div v-else>
      <el-date-picker v-if="!readerMode" v-model="_value" :value-format="format" size="medium" clearable :type="type" :placeholder="placeholder"></el-date-picker>
      <div v-else v-text="value"></div>
    </div>
  </div>
</template>

<script setup name="DateTime">
import { computed } from 'vue'

const props = defineProps({
  value: {
    default: null
  },
  format: {
    type: String,
    default: 'yyyy-MM-dd HH:mm'
  },
  placeholder: {
    type: String,
    default: '选择日期时间'
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

const type = computed(() => {
  switch (props.format) {
    case 'yyyy': return 'year';
    case 'yyyy-MM': return 'month';
    case 'yyyy-MM-dd': return 'date';
    case 'yyyy-MM-dd HH:mm': return 'datetime';
    default: return 'datetime';
  }
})
</script>

<style scoped>

</style>
