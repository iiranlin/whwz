<template>
  <ep-dialog title="审核历史" iconTitle="form" v-model="visible" width="1000px" top="5vh" append-to-body>
    <div class="sso-front-table-container app-container">
      <el-form class="form-wrapper" :model="formData" ref="elForm" label-width="110px"> 
        <div class="form-left flex1">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="outsaleCode" label="调拨(销售)单号：">
                <span>{{ formData.outsaleCode }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <!-- 表格数据 -->
      <table-index class="table-index" :selectionShow="false" :tableJson="historyTableJson" :tableData="tableData">
      </table-index>
    </div>
  </ep-dialog>
</template>

<script setup>
import { historyTableJson } from "./tableJson"
import { workflowHistoryList } from '@/api/workflow'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const tableData = ref([])
const formData = ref({outsaleCode: ''})

const getList = ({mtId, outsaleCode}) => {
  formData.value.outsaleCode = outsaleCode
  proxy.$modal.loading()
  workflowHistoryList({billId: mtId}).then( ({data}) => {
    tableData.value = data?.recordList || []
  }).finally( () => {
    proxy.$modal.closeLoading()
  })

}

// 显示弹框
function show(billId = '') {
  visible.value = true
  getList(billId)
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
.app-container{
  padding: 0 15px 15px 15px;
}
</style>