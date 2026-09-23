<template>
   <el-form-item :class="cls" label="库存不为0" :key="nav">
        <el-checkbox @change="handleChange" :checked="checked"></el-checkbox>
      </el-form-item>
</template>

<script setup name="zore">
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  cls: {
    type: String,
    default: 'custom-form-item',
  },
  value: {
    type: Object,
    default: () => {
      return {
        isNull: false
      }
    }
  }
});

const emit = defineEmits(['change']);

const nav = ref(Date.now());
const checked = ref(false);

watch(() => props.value, (n) => {
  nextTick(() => {
    checked.value = n.isNull;
    nav.value = Date.now();
  });
}, {
  deep: true,
  immediate: true,
});

function handleChange(val) {
  emit('change', {...props.value, isNull: val});
}
</script>