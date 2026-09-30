<template>
  <div style="margin-top: 10px">
    <el-tag class="org-item" :type="org.type === 'dept'?'':'info'"
            v-for="(org, index) in _value" :key="index + '_org'"
            closable size="mini" @close="removeOrgItem(index)">
      {{ org.name || org.roleName }}
    </el-tag>
  </div>
</template>

<script setup name="OrgItems">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => {
      return []
    }
  }
})
const emit = defineEmits(['update:modelValue', 'removeOrgItem'])

const _value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function removeOrgItem(index) {
  _value.value.splice(index, 1);
  emit("removeOrgItem");
}
</script>

<style scoped>
.org-item{
  margin: 5px;
}
</style>
