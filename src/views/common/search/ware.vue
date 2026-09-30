<template>
  <el-form-item class="custom-form-item" :label="label">
    <el-select @change="handleSelectChange" style="width: 100%" v-model="value[field2]" filterable placeholder="请选择仓库"
      clearable>
      <el-option v-for="(item, index) in options" :key="index" :label="item.warehouseName" :value="item.id">
      </el-option>
    </el-select>
  </el-form-item>
</template>
<script setup name="ware">
import { ref, watch } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: '仓库',
  },
  field1: {
    type: String,
    default: 'region',
  },
  field2: {
    type: String,
    default: 'ware',
  },
  value: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

const emit = defineEmits(['change']);

const options = ref([]);

watch(() => props.value, (n) => {
  if(!!n[props.field1]) {
    // loadData(n[props.field1])
  }else {
    options.value = [];
  }
}, {
  deep: true,
  immediate: true,
});

// async function loadData(region) {
//   const { data: { warehouseListMap } } = await getAreaAndWarehouse()
//   options.value = warehouseListMap[region] || []
// }

function handleSelectChange(val) {
  emit('change', { ...props.value, [props.field2]: val });
}
</script>