<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-select class="max-fill" v-if="!expanding" size="medium" v-model="_value" disabled :placeholder="placeholder"/>
      <el-radio-group v-model="_value" v-else>
        <el-radio disabled v-for="(op, index) in options" :key="index" :label="op">{{op}}</el-radio>
      </el-radio-group>
    </div>
    <div v-else>
      <template v-if="!readerMode">
        <el-select class="max-fill" v-if="!expanding" v-model="_value" size="medium" clearable :placeholder="placeholder">
          <el-option v-for="(op, index) in options" :key="index" :value="op" :label="op"></el-option>
        </el-select>
        <el-radio-group v-model="_value" v-else>
          <el-radio v-for="(op, index) in options" :key="index" :label="op">{{op}}</el-radio>
        </el-radio-group>
      </template>
      <template v-else>
        <div v-text="_value"></div>
      </template>
    </div>
  </div>
</template>

<script setup name="SelectInput">
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: String,
    default: null
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  expanding: {
    type: Boolean,
    default: false
  },
  options: {
    type: Array,
    default: () => {
      return []
    }
  },
  readerMode: {
    type: Boolean,
    default: false
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
