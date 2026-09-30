<template>
  <el-dialog custom-class="custom-dialog" class="border" :width="width" :title="title"
             append-to-body :close-on-click-modal="clickClose"
             :destroy-on-close="closeFree" v-model:visible="_value"
             :show-footer="showFooter">
    <slot></slot>
    <template #footer v-if="showFooter">
      <div>
        <el-button size="mini" @click="_value = false; emit('cancel')">{{ cancelText }}</el-button>
        <el-button size="mini" type="primary" @click="emit('ok')">{{ okText }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="WDialog">
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '50%'
  },
  value: {
    type: Boolean,
    default: false
  },
  clickClose: {
    type: Boolean,
    default: false
  },
  closeFree: {
    type: Boolean,
    default: false
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: '取 消'
  },
  okText: {
    type: String,
    default: '确 定'
  },
  border: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['input', 'ok', 'cancel'])

const _value = computed({
  get: () => props.value,
  set: (val) => emit('input', val)
})
</script>

<style lang="scss" scoped>
:deep(.custom-dialog) {
  .el-dialog__header {
    padding: 10px 20px;
    .el-dialog__title{
      font-size: 17px;
    }
    .el-dialog__headerbtn{
      top: 15px;
      .i{
        font-size: large;
      }
    }
  }

  .el-dialog__footer {
    padding: 10px 20px;
  }
}

 .border {
   :deep(.el-dialog__header) {
    border-bottom: 1px solid #e8e8e8;
  }
   :deep(.el-dialog__footer) {
    border-top: 1px solid #e8e8e8;
  }
}
</style>
