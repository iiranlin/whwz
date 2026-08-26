<!-- 审核历史弹窗 -->
<template>
  <ep-dialog title="流程跟踪列表" iconTitle="form" v-model="visible" width="970px" top="5vh" append-to-body>
    <div class="sso-front-table-container app-container">
      <el-table v-loading="loading" :data="tableData" border fit stripe height="100%">
        <el-table-column align="center" prop="unitName" label="单位" min-width="140" show-overflow-tooltip />
        <el-table-column align="center" prop="userName" label="操作人" min-width="100" />
        <el-table-column align="center" label="开始时间" min-width="150">
          <template #default="{ row }">
            <span>{{ parseTime(row.startTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="结束时间" min-width="150">
          <template #default="{ row }">
            <span>{{ parseTime(row.endTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="statusDesc" label="状态" min-width="100" />
        <el-table-column align="center" prop="comments" label="审批意见" min-width="180" show-overflow-tooltip />
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup name="self-supply-order-history">
import { parseTime } from '@/utils/generalMethod'
import { getAuditLogList } from '@/api/warehouse/selfSupplyOrder'

const visible = ref(false)
const loading = ref(false)
const tableData = ref([])

/** 打开弹窗 */
function show(row) {
  visible.value = true
  loading.value = true
  getAuditLogList({ pdmId: row.pdmId }).then(({ data }) => {
    tableData.value = data || []
  }).finally(() => {
    loading.value = false
  })
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped></style>
