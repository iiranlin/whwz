<!-- 自采供货单维护 -->
<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
    <el-pro-table ref="proTableRef" :columns="columnsData" :page-size="queryParams.pageSize"
      :toolbar-config="toolbarConfig" @action="onAction" :data="tableData"
      :total="total" @search="onSearch" table-id="self-supply-order-maintain" :show-checkbox="true"
      action-width="100" :default-search-form="defaultSearchForm" :grid-options="{ rowId: 'pdmId' }" />
        </el-col>
    </el-row>
    <order-history ref="orderHistoryRef" />
    <order-tracking-dialog ref="orderTrackingRef" />
    <print-dialog ref="printDialogRef" />
  </div>
</template>
<script setup name="self-supply-order-maintain">
import OrderHistory from "./components/orderHistory.vue"
import OrderTrackingDialog from "./components/orderTrackingDialog.vue"
import PrintDialog from "./components/printDialog.vue"
import {
  getPurchaseOrderMtList,
  deletePurchaseOrderMt,
  submitAudit,
  withdrawPurchaseOrder,
  pushPurchaseOrder,
} from '@/api/warehouse/selfSupplyOrder'
import { columns } from './tableJson'
import { getCookie } from '@/utils/auth'

const { proxy } = getCurrentInstance()

const columnsData = ref([])
const proTableRef = shallowRef(null)
const tableData = ref([])
const loading = ref(false)
const total = ref(0)
const selectionData = ref([])

const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
  // 状态默认查询未提交(1)、已提交(2)，与原系统一致
  status: '1,2',
})

// 搜索区状态多选默认值（ElProTable 中为数组）
const defaultSearchForm = {
  status: ['1', '2'],
}

/** 查询列表 */
function getList() {
  loading.value = true
  getPurchaseOrderMtList(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

const onSearch = (params, pageConfig) => {
  const p = { ...params }
  // 状态多选：数组转为逗号分隔字符串（后端 status 接收 "1,2"）
  if (Array.isArray(p.status)) {
    p.status = p.status.join(',')
  }
  // dateRange 拆分字段名转换：ElProTable 拆为 xxxStart/xxxEnd，后端为 xxxBegin/xxxEnd（End 同名无需转换）
  ;['makeDate', 'subDate', 'auditDate'].forEach(key => {
    if (p[key + 'Start']) {
      p[key + 'Begin'] = p[key + 'Start']
      delete p[key + 'Start']
    }
  })
  queryParams.value = { ...p, ...pageConfig }
  getList()
}

const onSelectionChange = (rows) => {
  selectionData.value = rows
}

const toolbarConfig = {
  buttons: [
    {
      code: 'create',
      name: '新增',
      type: 'primary',
      showInTop: true,
    },
    {
      code: 'modify',
      name: '修改',
      type: 'primary',
      showInTop: false,
      showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return !['1', '4'].includes(row.status)
      },
    },
    {
      code: 'delete',
      name: '删除',
      type: 'primary',
      showInTop: true,
      disabled: (selectedRows) => {
        if (selectedRows.length === 0) return false
        return selectedRows.some(a => a.status !== '1')
      },
    },
    // {
    //   code: 'submit',
    //   name: '提交审批',
    //   type: 'primary',
    //   showInTop: true,
    //   disabled: (selectedRows) => {
    //     if (selectedRows.length === 0) return false
    //     return selectedRows.some(a => !['1', '4', '7'].includes(a.status) || a.auditStatus === '1')
    //   },
    // },
    // {
    //   code: 'withdraw',
    //   name: '撤回',
    //   type: 'primary',
    //   showInTop: true,
    //   disabled: (selectedRows) => {
    //     if (selectedRows.length === 0) return false
    //     return selectedRows.some(a => !['2', '8'].includes(a.status))
    //   },
    // },
    {
      code: 'push',
      name: '提交供货单',
      type: 'primary',
      showInTop: true,
      // disabled: (selectedRows) => {
      //   if (selectedRows.length === 0) return false
      //   return selectedRows.some(a => a.status !== '3')
      // },
    },
    // {
    //   code: 'detail',
    //   name: '详情',
    //   type: 'primary',
    //   showInTop: false,
    //   showInRow: true,
    // },
    // {
    //   code: 'print',
    //   name: '打印',
    //   type: 'primary',
    //   showInTop: false,
    //   showInRow: true,
    // },
    // {
    //   code: 'track',
    //   name: '供货单追踪',
    //   type: 'primary',
    //   showInTop: false,
    //   showInRow: true,
    // },
    // {
    //   code: 'history',
    //   name: '审核历史',
    //   type: 'primary',
    //   showInTop: false,
    //   showInRow: true,
    // },
  ]
}

const onAction = ({ code, row, selectedRows }) => {
  const eventObj = {
    // 新增（跳转到编辑页面）
    create: () => {
      proxy.$router.push({ path: '/material-accept/self-supply-order/maintain/edit', query: { type: 'create' } })
    },
    // 修改（跳转到编辑页面）
    modify: () => {
      proxy.$router.push({ path: '/material-accept/self-supply-order/maintain/edit', query: { type: 'modify', pdmId: row.pdmId } })
    },
    // 删除
    delete: () => {
      handleDelete(selectedRows)
    },
    // 提交审批
    submit: () => {
      handleSubmit(selectedRows)
    },
    // 撤回
    withdraw: () => {
      handleWithdraw(selectedRows)
    },
    // 提交供货单
    push: () => {
      handlePush(selectedRows)
    },
    // 详情（跳转到详情页面）
    detail: () => {
      proxy.$router.push({ path: '/material-accept/self-supply-order/maintain/detail', query: { pdmId: row.pdmId } })
    },
    // 采购订单号链接 -> 订单明细（跳转到详情页面）
    link: () => {
      proxy.$router.push({ path: '/material-accept/self-supply-order/maintain/detail', query: { pdmId: row.pdmId } })
    },
    // 打印
    print: () => {
      proxy.$refs.printDialogRef.show(row)
    },
    // 供货单追踪
    track: () => {
      proxy.$refs.orderTrackingRef.show(row)
    },
    // 审核历史
    history: () => {
      proxy.$refs.orderHistoryRef.show(row)
    },
  }
  eventObj[code] && eventObj[code]()
}

// 删除
const handleDelete = (selectedRows) => {
  if (selectedRows.length === 0) {
    proxy.$modal.msgWarning('请至少选择一条数据')
    return
  }
  if (selectedRows.some(item => item.status !== '1')) {
    proxy.$modal.msgWarning('当前选择数据不能删除')
    return
  }
  proxy.$modal.confirm('确定要删除吗？').then(() => {
    const pdmIds = selectedRows.map(item => item.pdmId)
    deletePurchaseOrderMt(pdmIds).then(({ message }) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  })
}

// 提交审批
const handleSubmit = (selectedRows) => {
  if (selectedRows.length === 0) {
    proxy.$modal.msgWarning('请至少选择一条数据')
    return
  }
  if (selectedRows.some(item => item.auditStatus === '1')) {
    proxy.$modal.msgWarning('当前审批节点不一致，请重新选择数据')
    return
  }
  const pdmIds = selectedRows.map(item => item.pdmId)
  proxy.$modal.confirm('您确定要报批所选供货单吗？').then(() => {
    // 无工作流：直接报批，不走"选审批人"弹窗（$reviewerDialog），不再传 auditUserId/processKey
    // 将来接入工作流：放开下方 $reviewerDialog 调用并传 auditUserId/processKey
    // proxy.$reviewerDialog({
    //   billType: 'ZCGHD',
    //   billIdList: pdmIds,
    //   multiple: true,
    //   success: ({ auditUserId }) => {
    submitAudit({
      businessIds: pdmIds,
      businessIdMap: {},
      auditType: '1',
    }).then(({ message }) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
    //   }
    // })
  })
}

// 撤回
const handleWithdraw = (selectedRows) => {
  if (selectedRows.length === 0) {
    proxy.$modal.msgWarning('请至少选择一条数据')
    return
  }
  if (selectedRows.some(item => !['2', '8'].includes(item.status))) {
    proxy.$modal.msgWarning('只有已提交,已推送状态的数据可以撤回')
    return
  }
  proxy.$modal.confirm('确定要撤回吗？').then(() => {
    const businessIds = selectedRows.map(item => item.pdmId)
    withdrawPurchaseOrder({ businessIds, railwayCode: getCookie('parentUnitCode') || getCookie('railwayCode') }).then(({ message }) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  })
}

// 推送
const handlePush = (selectedRows) => {
  if (selectedRows.length === 0) {
    proxy.$modal.msgWarning('请至少选择一条数据')
    return
  }
  // if (selectedRows.some(item => item.status !== '3')) {
  //   proxy.$modal.msgWarning('只有已审核的数据才能推送')
  //   return
  // }
  proxy.$modal.confirm('您确定要推送所选供货单吗？').then(() => {
    const pdmIds = selectedRows.map(item => item.pdmId)
    pushPurchaseOrder(pdmIds).then(({ message }) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  })
}

// 拆单入口已在原系统中不存在（原系统无拆单功能，对齐原页面时移除）

const init = async () => {
  columnsData.value = await columns()
  // 挂载即查询：首次进菜单、从编辑/详情页返回（无keep-alive组件重建）均会触发
  getList()
}
onMounted(() => {
  init()
  // getList()
})
</script>
<style lang="scss"></style>
