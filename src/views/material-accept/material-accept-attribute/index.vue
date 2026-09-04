<template>
  <div class="app-container app-container-splitpanes">
    <!-- <el-tabs v-model="activeName" :destory-inactive="true">
      <el-tab-pane label="物资批次管理" name="batch">
        <batch-manage v-if="activeName === 'batch'" />
      </el-tab-pane>
      <el-tab-pane label="换算依据管理" name="conversion">
        <conversion-manage v-if="activeName === 'conversion'" />
      </el-tab-pane>
    </el-tabs> -->
    <batch-manage />
  </div>
</template>

<script setup>
import BatchManage from "./batch-manage/index.vue";
// import ConversionManage from "./conversion-manage/index.vue";

// const activeName = ref("batch"); // conversion

</script>

<style lang="scss" scoped>
.material-accetp-attribute-page {
  // padding-top: 0;
  :deep(.ep-tabs) {
    height: 100%;
    // flex-grow: 1;
    .ep-tabs__content {
      .ep-tab-pane {
        height: 100%;
      }
    }
  }
}
</style>