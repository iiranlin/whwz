<template>
  <el-form-item class="custom-form-item" label="单位">
    <el-tree-select
      v-model="value.unit"
      :data="options"
      :props="{ label: 'label', children: 'children', disabled: 'isDisabled' }"
      node-key="id"
      placeholder="请选择单位"
      empty-text="暂无数据"
      clearable
      @change="handleSelectChange"
    />
  </el-form-item>
</template>
<script setup name="unit">
import { ref, onMounted } from 'vue';
import {
  getDeptTreeByUser,
  getDeptTreeByUserByOrg
} from '@/api/system/dept';
// import { getAreaAndWarehouse } from "@/api/stock/warehouse/inReady/vmiWarehouseInReady";

const props = defineProps({
  value: {
    type: Object,
    default: () => {
      return {
        unit: undefined
      }
    }
  }
});

const emit = defineEmits(['change']);

const options = ref([]);

onMounted(() => {
  loadData();
});

async function loadData() {
  const { data } = await getDeptTreeByUser();
  options.value = normalizeraList(data || []);
}

function normalizeraList(list) {
  return list.map(node => {
    if (node.children && !node.children.length) {
      delete node.children;
    }
    const normalized = {
      id: node.unitId,
      label: node.unitName,
      children: node.children ? normalizeraList(node.children) : undefined,
      isDisabled: !!(node.children && node.children.length)
    };
    if (!normalized.children) delete normalized.children;
    return normalized;
  });
}

function handleSelectChange(val) {
  emit('change', { ...props.value, dept: undefined, unit: val });
}
</script>
