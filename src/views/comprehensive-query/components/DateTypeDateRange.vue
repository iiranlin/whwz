<template>
  <div class="date-type-date-range" style="display: flex; gap: 0; width: 100%">
    <el-select
      v-model="localDateType"
      class="date-type-select"
      :clearable="selectClearable"
      placeholder="日期类型"
      style="width: 100px; flex-shrink: 0"
      @change="emitValue"
    >
      <el-option
        v-for="opt in options"
        :key="opt.value"
        :label="opt.label"
        :value="opt.value"
      />
    </el-select>
    <el-date-picker
      v-model="localDateRange"
      class="date-range-picker"
      type="daterange"
      :clearable="dateClearable"
      value-format="YYYY-MM-DD"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      style="flex: 1"
      @change="emitValue"
    />
  </div>
</template>

<script setup name="DateTypeDateRange">
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: null, default: () => ({}) },
  options: { type: Array, default: () => [] },
  selectClearable: { type: Boolean, default: true },
  dateClearable: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change'])

const localDateType = ref(null)
const localDateRange = ref(null)

function syncFromValue(val) {
  if (!val) {
    localDateType.value = null
    localDateRange.value = null
    return
  }
  if (Array.isArray(val)) {
    localDateType.value = null
    localDateRange.value = val
    return
  }
  localDateType.value = val.dateType ?? null
  localDateRange.value = val.dateRange ?? null
}

syncFromValue(props.modelValue)
watch(() => props.modelValue, syncFromValue, { deep: true })

function emitValue() {
  const payload = {
    dateType: localDateType.value ?? '',
    dateRange: localDateRange.value ?? null,
  }
  emit('update:modelValue', payload)
  emit('change', payload)
}
</script>
