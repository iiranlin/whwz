<template>
  <div style="max-width: 350px">
    <div v-if="mode === 'DESIGN'">
      <el-button disabled icon="iconfont icon-map-site" type="primary" size="mini" round> 选择部门</el-button>
      <span class="placeholder"> {{placeholder}}</span>
    </div>
    <div v-else>
      <el-button icon="iconfont icon-map-site" type="primary" size="mini" round @click="orgPickerRef.show()"> 选择部门</el-button>
      <org-picker type="dept" :multiple="multiple" ref="orgPickerRef" :selected="_value" @ok="selected"/>
      <span class="placeholder"> {{placeholder}}</span>
      <div style="margin-top: 5px">
        <el-tag size="mini" style="margin: 5px" closable v-for="(dept, i) in _value" :key="dept.name" @close="delDept(i)">{{dept.name}}</el-tag>
      </div>
    </div>
  </div>
</template>

<script setup name="DeptPicker">
import { computed, ref } from 'vue'
import OrgPicker from "@/components/common/OrgPicker";

const props = defineProps({
  value: {
    type: Array,
    default: () => {
      return []
    }
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  multiple: {
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

const orgPickerRef = ref(null)
const showOrgSelect = ref(false)

function selected(values) {
  showOrgSelect.value = false
  emit('input', values)
}
function delDept(i) {
  const arr = [..._value.value]
  arr.splice(i, 1)
  emit('input', arr)
}
</script>

<style scoped>
.placeholder{
  margin-left: 10px;
  color: #adabab;
  font-size: smaller;
}
</style>
