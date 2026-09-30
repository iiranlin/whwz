<template>
  <el-form-item class="custom-form-item" :label="label">
    <el-select @change="handleSelectChange" style="width: 100%" v-model="value[field1]" filterable placeholder="请选择地区"
      clearable>
      <el-option v-for="(item, index) in options" :key="index" :label="item.areaName" :value="item.id">
      </el-option>
    </el-select>
  </el-form-item>
</template>
<script setup name="region">
import { ref, watch } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: '地区',
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
  if(!!n.unit || !!n.dept) {
    const id = n.dept || n.unit;
    loadData(id);
  }
}, {
  deep: true,
  immediate: true,
});

async function loadData(id) {
  // const { data: { areaList } } = await getAreaAndWarehouse({orgId: id})
  // options.value = areaList
}

function handleSelectChange(val) {
  const w = {ware: undefined, ware1: undefined};
  emit('change', { ...props.value, ...w, [props.field1]: val });
}
</script>