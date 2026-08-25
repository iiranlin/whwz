<template>
  <qrcode-vue :value="text" :size="size" level="H" />
</template>

<script setup>
import QrcodeVue from 'qrcode.vue'

// 接收参数并指定类型（可选）
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: 200
  },
})

</script>