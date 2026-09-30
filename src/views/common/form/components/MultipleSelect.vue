<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-select class="max-fill" v-if="!expanding" size="medium" multiple v-model="_value" disabled :placeholder="placeholder"/>
      <el-checkbox-group v-else v-model="_value">
        <el-checkbox disabled v-for="(op, index) in options" :key="index" :label="op">{{op}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div v-else>
      <template v-if="!readerMode">
        <el-select class="max-fill" v-if="!expanding" v-model="_value" multiple size="medium" clearable :placeholder="placeholder">
          <el-option v-for="(op, index) in options" :key="index" :value="op" :label="op"></el-option>
        </el-select>
        <el-checkbox-group v-else v-model="_value">
          <el-checkbox v-for="(op, index) in options" :key="index" :label="op">{{op}}</el-checkbox>
        </el-checkbox-group>
      </template>
      <template v-else>
        <span>{{ readerValue }}</span>
      </template>
    </div>
  </div>
</template>

<script setup name="MultipleSelect">
import { computed } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: '请选择'
  },
  value: {
    type: Array,
    default: () => {
      return []
    }
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

const readerValue = computed(() => {
  return props.value.join(", ")
})
</script>

<style scoped>

</style>
