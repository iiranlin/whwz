<template>
  <div class="matl-batch-confirm-dialog">
    <el-dialog class="dialog" :model-value="visible" :width="width" top="5vh" draggable @close="dialogClose" destroy-on-close>
      <template #header>
        <span><svg-icon :icon-class="iconTitle" v-if="iconTitle" /> {{ title }}</span>
      </template>
      <div class="app-container">
        <div class="matl-batch-confirm-dialog-empty-image">
          <img src="@/assets/images/u538.png" alt="">
        </div>
        <div class="matl-batch-confirm-dialog-empty-tip">
          该物料已有出入库记录，需先清空现有库存后才可关闭。
        </div>
      </div>
      <template #footer>
        <div>
          <el-button @click="dialogClose">取消</el-button>
          <el-button type="primary" @click="dialogClose">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  iconTitle: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: '新增'
  },
  width: {
    type: String,
    default: '800px'
  },
  visible: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['dialogClose']);

const dialogClose = () => {
  emit('dialogClose');
}
</script>

<style lang="scss" scoped>
.matl-batch-confirm-dialog {
  :deep(.ep-dialog) {
    .app-container {
      margin-bottom: 40px;
    }
    .matl-batch-confirm-dialog-empty-image {
      display: flex;
      justify-content: center;
      align-items: center;
      >img {
        width: 298px;
        height: 186px;
      }
    }
    .matl-batch-confirm-dialog-empty-tip {
      display: flex;
      justify-content: center;
      font-size: 18px;
    }
  }
}
</style>