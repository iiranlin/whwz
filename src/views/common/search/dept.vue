<template>
  <el-form-item class="custom-form-item" label="部门">
    <el-tree-select
      v-model="value.dept"
      :data="options"
      :props="{ label: 'label', children: 'children' }"
      node-key="id"
      placeholder="请选择部门"
      empty-text="暂无数据"
      @change="handleSelectChange"
    />
  </el-form-item>
</template>
<script setup name="dept">
import { ref, watch } from 'vue';
import {
  getDeptTreeByUser,
} from "@/api/system/dept";

const props = defineProps({
  value: {
    type: Object,
    default: () => {
      return {
        dept: undefined
      }
    }
  }
});

const emit = defineEmits(['change']);

const options = ref([]);

watch(() => props.value, (n) => {
  if (n && !!n.unit) {
    loadData(n.unit);
  } else {
    options.value = [];
  }
}, {
  deep: true,
  immediate: true,
});

async function loadData(id) {
  const { data } = await getDeptTreeByUser({ id });
  options.value = normalizerList(data || []);
}

function normalizerList(list) {
  return list.map(node => {
    if (node.children && !node.children.length) {
      delete node.children;
    }
    const normalized = {
      id: node.id,
      label: node.deptName,
      children: node.children ? normalizerList(node.children) : undefined
    };
    if (!normalized.children) delete normalized.children;
    return normalized;
  });
}

function handleSelectChange(val) {
  emit('change', { ...props.value, dept: val });
}
</script>
