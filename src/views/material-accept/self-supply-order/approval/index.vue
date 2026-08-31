<!-- 自采供货单审批 -->
<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
    <el-pro-table ref="proTableRef" :columns="columnsData" :page-size="queryParams.pageSize"
      :toolbar-config="toolbarConfig" @action="onAction" :data="tableData"
      :total="total" @search="onSearch" table-id="self-supply-order-approval" :show-checkbox="true"
      :grid-options="{ rowId: 'pdmId' }" :default-search-form="defaultSearchForm" @selection-change="onSelectionChange" />
        </el-col>
    </el-row>
    <order-detail ref="orderDetailRef" />
    <order-history ref="orderHistoryRef" />
    <process-approval ref="processApprovalRef" @saveProcessApproval="saveProcessApproval" />
  </div>
</template>
<script setup name="self-supply-order-approval">
import { columns } from './tableJson'
import { getAuditOrderMtList, auditPurchaseOrder } from '@/api/warehouse/selfSupplyOrder'
import OrderDetail from '../maintain/components/orderDetail.vue'
import OrderHistory from '../maintain/components/orderHistory.vue'
import ProcessApproval from './components/processApproval.vue'
const { proxy } = getCurrentInstance()

const columnsData = ref([])
const proTableRef = shallowRef(null)
const tableData = ref([])
const loading = ref(false)
const total = ref(0)
const selectionData = ref([])

// 默认查询条件：待审批
const defaultSearchForm = { auditStatus: '0' }

const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
  auditStatus: '0',
})

/** 查询列表 */
function getList() {
  loading.value = true
  getAuditOrderMtList(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

const onSearch = (params, pageConfig) => {
  queryParams.value = { ...params, ...pageConfig }
  getList()
}

const onSelectionChange = (rows) => {
  selectionData.value = rows
}

const toolbarConfig = {
  buttons: [
    {
      code: 'audit',
      name: '审批',
      type: 'primary',
      showInTop: true,
      disabled: (selectedRows) => {
        if (selectedRows.length === 0) return true
        return selectedRows.some(item => item.auditStatus !== '0')
      },
    },
    {
      code: 'history',
      name: '审核历史',
      type: 'primary',
      showInTop: false,
      showInRow: true,
    },
    {
      code: 'print',
      name: '打印',
      type: 'primary',
      showInTop: false,
      showInRow: true,
    },
  ]
}

const onAction = ({ code, row, selectedRows }) => {
  const eventObj = {
    // 审批
    audit: () => {
      handleAudit(selectedRows)
    },
    // 审核历史
    history: () => {
      proxy.$refs.orderHistoryRef.show(row)
    },
    // 打印
    print: () => {
      handlePrint(row)
    },
    // 采购订单号链接 -> 订单明细
    link: () => {
      proxy.$refs.orderDetailRef.show(row, '2')
    },
  }
  eventObj[code] && eventObj[code]()
}

/** 审批 */
function handleAudit(selectedRows) {
  if (!selectedRows.length) {
    proxy.$modal.msgWarning('请至少选择一条数据')
    return
  }
  if (selectedRows.some(item => item.auditStatus == '1')) {
    proxy.$modal.msgWarning('当前审批节点不一致，请重新选择数据')
    return
  }
  const ids = selectedRows.map(item => item.pdmId)
  proxy.$refs.processApprovalRef.init(ids)
}

/** 审批保存 */
function saveProcessApproval(data) {
  loading.value = true
  auditPurchaseOrder(data).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    getList()
  }).finally(() => {
    loading.value = false
  })
}

/** 打印（TODO: 目标系统打印路由若不同需调整） */
function handlePrint(row) {
  const routeUrl = proxy.$router.resolve({
    path: '/printCopy',
    query: { type: '3', id: row.pdmId },
  })
  window.open(routeUrl.href, '_blank')
}

onMounted(() => {
  columnsData.value = columns
  getList()
})
</script>
<style lang="scss"></style>
