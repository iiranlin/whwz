<!-- 供货单追踪弹窗（订单日志，对应原系统 orderTracking） -->
<template>
  <ep-dialog title="供货单追踪" iconTitle="form" v-model="visible" width="1100px" top="8vh" append-to-body>
    <div class="track-table">
      <el-table v-loading="loading" :data="tableData" border fit stripe height="100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column align="center" label="操作时间" min-width="160">
          <template #default="{ row }">
            <span>{{ parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="content" label="操作内容" min-width="220" show-overflow-tooltip />
        <el-table-column align="center" label="状态" min-width="90">
          <template #default="{ row }">
            <span>{{ operateType[row.type] ?? row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="railwayName" label="路局" min-width="120" show-overflow-tooltip />
        <el-table-column align="center" prop="unitName" label="需求单位" min-width="150" show-overflow-tooltip />
        <el-table-column align="center" prop="userName" label="操作人" min-width="90" />
        <el-table-column align="center" prop="comments" label="备注" min-width="140" show-overflow-tooltip />
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup name="self-supply-order-tracking">
import { getOrderTrackList } from '@/api/warehouse/selfSupplyOrder'
import { parseTime } from '@/utils/generalMethod'

const visible = ref(false)
const loading = ref(false)
const tableData = ref([])

// 供货单类型状态映射（对应原系统 operateType）
const operateType = {
  0: '待审批',
  1: '已提交',
  2: '已审批',
  3: '已回退',
}

function show(row) {
  visible.value = true
  getTrackList(row)
}

function getTrackList(row) {
  loading.value = true
  getOrderTrackList(row.pdmId).then(({ data }) => {
    tableData.value = data || []
  }).finally(() => {
    loading.value = false
  })
}

defineExpose({
  show,
})
</script>

<style lang="scss" scoped>
.track-table {
  height: 60vh;
}
</style>
