<template>
  <el-form-item class="custom-form-item" :label="label">
    <el-select allow-create @change="handleSelectChange" style="width: 100%" v-model="formData[field]" filterable
      placeholder="请选择" clearable @clear="handleSelectClear">
      <el-option v-for="(item, index) in options" :key="index" :label="item" :value="item">
      </el-option>
    </el-select>
  </el-form-item>
</template>
<script setup name="search-select">
import { ref, watch } from 'vue';
import { getSelectData } from "@/api/common";
// import { getAreaAndWarehouse } from "@/api/stock/warehouse/inReady/vmiWarehouseInReady";

const props = defineProps({
  type: {
    type: String,
    default: '',
  },
  field: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  areaName: {
    type: String,
    default: '',
  },
  formData: {
    type: Object,
    default: function () {
      return {};
    },
  },
});

const emit = defineEmits(['change', 'clear']);

const options = ref([]);

watch(() => props.type, (type) => {
  // loadData(type)
}, {
  deep: true,
  immediate: true,
});

// async function loadData(type, areaName) {
//   if (['areaName', 'warehouseName'].includes(field)) {
//     const { data: { warehouseListMap, areaList } } = await getAreaAndWarehouse()
//     if (['areaName'].includes(field)) {
//       const options = areaList.map(item => item.areaName)
//       options.value = options
//     }
//     if (['warehouseName'].includes(field)) {
//       if (!!areaName) {
//         const [node] = areaList.filter(item => item.areaName == areaName)
//         if (node && node.id) {
//           options.value = warehouseListMap[node.id].map(({ warehouseName }) => warehouseName)
//           formData[field] = ""
//         } else {
//           formData[field] = ""
//           options.value = []
//         }
//       } else {
//         formData[field] = ""
//         options.value = []
//       }

//     }
//   } else {
//     const { data } = await getSelectData({ type: type })
//     const options = data[field] || []
//     options.value = options.filter(item => !!item)
//   }

// }

function setArea(val) {
  loadData('', val);
}

function handleSelectChange(val) {
  emit('change', props.field, val);
}

function handleSelectClear() {
  emit('clear', props.field);
}

function reset() {
  props.formData[props.field] = "";
}

function updateOptions(ops = []) {
  props.formData[props.field] = "";
  options.value = [ ...ops ];
}
</script>
