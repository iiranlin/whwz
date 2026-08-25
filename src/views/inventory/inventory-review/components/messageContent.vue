<template>
  <div class="message-content-box">
    <div class="message-content-box-top">
      <i class="ep-icon ep-message-box__status ep-message-box-icon--warning"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 192a58.43 58.43 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.43 58.43 0 0 0 512 256m0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4"></path></svg></i>
      <div>{{ _info }}</div>
    </div>
    <el-divider />
    <div class="message-content-box-bottom">
      <div class="message-content-box-bottom-item" v-for="item in _arr">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  _info: {
    type: String,
    default: ""
  },
  _arr: {
    type: Array,
    default: () => [],
  }
});

onMounted(() => {
})

</script>

<style lang="scss" scoped>
.message-content-box {
  .message-content-box-top {
    display: flex;
    align-items: center;
    // justify-content: center;
    padding-left: 24px;
    >i {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      >svg {
        height: 32px;
        width: 32px;
        path {
          height: 32px;
          width: 32px;
        }
      }
    }
  }
  .ep-divider {
    margin-bottom: 16px;
  }
  .message-content-box-bottom {
    padding: 0 12px;
    .message-content-box-bottom-item {
      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }
  }
}
</style>
<style lang="scss">
.divider-message-box-inventory-common {
  .ep-message-box__content {
    .ep-message-box__container {
      width: 100%;
      .ep-message-box__message {
        flex: 1;
      }
    }
  }
}
</style>