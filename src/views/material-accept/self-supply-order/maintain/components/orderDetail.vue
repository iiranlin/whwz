<!-- 订单明细信息弹窗（详情/终止/验收历史） -->
<template>
  <ep-dialog title="订单明细信息" iconTitle="form" v-model="visible" width="80vw" top="5vh" append-to-body>
    <div class="sso-front-table-container app-container">
      <div v-if="pageType == 1" class="detail-toolbar">
        <el-button type="primary" @click="discontinue">终止</el-button>
      </div>
      <div class="detail-table">
        <el-table v-loading="loading" :data="tableData" border fit stripe height="100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" fixed="left" />
          <el-table-column type="index" label="序号" width="55" align="center" />
          <template v-for="col in detailConfig" :key="col.field">
            <el-table-column :label="col.title" :min-width="col.minWidth" :align="col.align"
              show-overflow-tooltip>
              <template #default="{ row }">
                <span v-if="col.field === 'smatlType'">{{ row.smatlType + (row.smatlRaw ? '/' + row.smatlRaw : '') + (row.smatlPcode ? '/' + row.smatlPcode : '') }}</span>
                <span v-else-if="col.dict">{{ col.dict[row[col.field]] ?? row[col.field] }}</span>
                <span v-else-if="col.field === 'purNum'">{{ format4(row[col.field]) }}</span>
                <span v-else-if="['contPrice', 'purAmount', 'sharePrice', 'offsetRate'].includes(col.field)">{{ format2(row[col.field]) }}</span>
                <span v-else>{{ row[col.field] }}</span>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="操作" fixed="right" align="center" width="110">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleAcceptHistory(row)">验收历史</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
      </div>
    </template>
    <accept-history-dialog ref="historyDialogRef" />
  </ep-dialog>
</template>

<script setup name="self-supply-order-detail">
import { orderDetailConfig } from './orderDetail'
import { getOrderMtDetail, stopPurchaseOrder } from '@/api/warehouse/selfSupplyOrder'
import { getCookie } from '@/utils/auth'
import AcceptHistoryDialog from './acceptHistoryDialog.vue'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const loading = ref(false)
const tableData = ref([])
const selectionData = ref([])
const rowData = ref({})
const pageType = ref(null)
const detailConfig = orderDetailConfig

const emit = defineEmits(['getList'])

/** 打开弹窗：type = 1 详情（可终止） */
function show(row, type = '1') {
  visible.value = true
  rowData.value = row
  pageType.value = type
  getDetail(row)
}

function handleSelectionChange(rows) {
  selectionData.value = rows
}

function getDetail(row) {
  loading.value = true
  getOrderMtDetail(row.pdmId).then(({ data }) => {
    ;(data.details || []).forEach(item => {
      item.taxRate = data.taxRate
    })
    tableData.value = data.details || []
  }).finally(() => {
    loading.value = false
  })
}

/** 终止所选明细 */
function discontinue() {
  if (!selectionData.value.length) {
    proxy.$modal.msgWarning('请至少选择一条数据')
    return
  }
  if (rowData.value.status != 8 && rowData.value.status != 7) {
    proxy.$modal.msgWarning('现在不允许终止操作')
    return
  }
  proxy.$modal.confirm('终止后不可取消终止，是否确定终止？').then(() => {
    const params = {
      railwayCode: getCookie('railwayCode'),
      pdmIds: [rowData.value.pdmId],
      pddIds: selectionData.value.map(item => item.pddId),
    }
    stopPurchaseOrder(params).then(() => {
      proxy.$modal.msgSuccess('操作成功')
      getDetail(rowData.value)
      emit('getList')
    })
  }).catch(() => {})
}

function handleAcceptHistory(row) {
  proxy.$refs.historyDialogRef.show(row)
}

function format2(val) {
  if (val === null || val === undefined || val === '') return ''
  return Number(val).toFixed(2)
}
function format4(val) {
  if (val === null || val === undefined || val === '') return ''
  return Number(val).toFixed(4)
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
.detail-toolbar {
  padding: 10px 0;
}
.detail-table {
  height: 50vh;
}
</style>
