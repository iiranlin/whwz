<template>
  <ep-dialog title="商城订单明细" iconTitle="form" v-model="visible" width="1000px" top="5vh" append-to-body>
    <div class="sso-front-table-container app-container">
      <!-- 表格数据 -->
      <table-index class="table-index" :selectionShow="false" :tableJson="checkDetailsTableJson" :tableData="tableData">
      </table-index>
    </div>
  </ep-dialog>
</template>

<script setup>
import { checkDetailsTableJson } from "../tableJson"
import { dtList } from '@/api/warehouse/orderMt'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const tableData = ref([])

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

const getDtList = (mtId) => {
  proxy.$modal.loading()
  dtList({mtId, pageSize: -1}).then( ({data}) => {
    tableData.value = data.list
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
}
// 显示弹框
function show(mtId) {
  visible.value = true
  getDtList(mtId)
}


defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
</style>