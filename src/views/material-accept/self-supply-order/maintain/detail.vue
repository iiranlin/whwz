<!-- 自采供货单 详情页面（由订单明细弹窗改为独立页面，路由 query 传 pdmId，保留终止与验收历史） -->
<template>
  <div class="app-container">
    <div class="sso-front-table-container">
      <!-- 主单信息（只读） -->
      <el-form label-width="110px" class="detail-head-form">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="采购订单号："><el-input :model-value="orderData.spdCode" disabled /></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商："><el-input :model-value="orderData.suName || orderData.suCode" disabled /></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="采购方式："><el-input :model-value="orderData.purcTypeName || orderData.purcTypeCode" disabled /></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用料地区："><el-input :model-value="orderData.plantName || orderData.plantCode" disabled /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
           <el-col :span="6">
            <el-form-item label="是否含税："><el-input :model-value="taxFlagText" disabled /></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="税率："><el-input :model-value="taxRateText" disabled /></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="备注："><el-input :model-value="orderData.comments" disabled /></el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider style="margin: 4px 0 10px;" />
      <div class="detail-toolbar">
        <!-- 审批页跳入（from=approval）只读查看，不显示终止（对齐原弹窗 pageType=2 行为） -->
        <el-button v-if="!isFromApproval" type="primary" @click="discontinue">终止</el-button>
        <el-button @click="goBack">返回</el-button>
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
    <accept-history-dialog ref="historyDialogRef" />
  </div>
</template>

<script setup name="self-supply-order-maintain-detail">
import { useRoute } from 'vue-router'
import { orderDetailConfig } from './components/orderDetail'
import { taxFlagOptions } from './tableJson'
import { getOrderMtDetail, stopPurchaseOrder } from '@/api/warehouse/selfSupplyOrder'
import { getCookie } from '@/utils/auth'
import AcceptHistoryDialog from './components/acceptHistoryDialog.vue'
const { proxy } = getCurrentInstance()
const route = useRoute()

// 列表页路径：返回时关闭当前页签并跳回（本项目 tagsView.delView 无 lastPath，closePage 会跳工作台，故用 closeOpenPage）
// 从审批页跳入（from=approval）时回审批列表，否则回维护列表
const isFromApproval = computed(() => route.query.from === 'approval')
const backPath = computed(() => isFromApproval.value
  ? '/material-accept/self-supply-order/approval/index'
  : '/material-accept/self-supply-order/maintain/index')

const loading = ref(false)
const tableData = ref([])
const selectionData = ref([])
// 主单数据（终止校验用 status，取接口返回，终止刷新后状态同步更新）
const orderData = ref({})
const detailConfig = orderDetailConfig

// 是否含税/税率 显示文本
const taxFlagText = computed(() => taxFlagOptions.find(o => o.value === String(orderData.value.taxFlag))?.label || orderData.value.taxFlag || '')
const taxRateText = computed(() => (orderData.value.taxRate === null || orderData.value.taxRate === undefined || orderData.value.taxRate === '') ? '' : orderData.value.taxRate + '%')

function handleSelectionChange(rows) {
  selectionData.value = rows
}

/** 按路由 query.pdmId 加载明细 */
function getDetail() {
  const pdmId = route.query.pdmId
  if (!pdmId) return
  loading.value = true
  getOrderMtDetail(pdmId).then(({ data }) => {
    orderData.value = data || {}
    ;(data.details || []).forEach(item => {
      item.taxRate = data.taxRate
    })
    tableData.value = data.details || []
  }).finally(() => {
    loading.value = false
  })
}

/** 终止所选明细（status 为 7/8 才允许，与原弹窗 pageType=1 行为一致） */
function discontinue() {
  if (!selectionData.value.length) {
    proxy.$modal.msgWarning('请至少选择一条数据')
    return
  }
  if (orderData.value.status != 8 && orderData.value.status != 7) {
    proxy.$modal.msgWarning('现在不允许终止操作')
    return
  }
  proxy.$modal.confirm('终止后不可取消终止，是否确定终止？').then(() => {
    const params = {
      // railwayCode: getCookie('railwayCode'),
      pdmIds: [orderData.value.pdmId],
      // pddIds: selectionData.value.map(item => item.pddId),
    }
    stopPurchaseOrder(params).then(() => {
      proxy.$modal.msgSuccess('操作成功')
      getDetail()
    })
  }).catch(() => {})
}

function handleAcceptHistory(row) {
  proxy.$refs.historyDialogRef.show(row)
}

/** 返回：关闭当前页签回到来源列表页（维护/审批） */
function goBack() {
  proxy.$tab.closeOpenPage({ path: backPath.value })
}

function format2(val) {
  if (val === null || val === undefined || val === '') return ''
  return Number(val).toFixed(2)
}
function format4(val) {
  if (val === null || val === undefined || val === '') return ''
  return Number(val).toFixed(4)
}

// 页签未关闭时从列表再次进入（query 变化、组件复用），重新加载明细
watch(() => route.query.pdmId, () => {
  getDetail()
})

onMounted(() => {
  getDetail()
})
</script>
<style lang="scss" scoped>
.detail-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0 10px;
}
.detail-table {
  height: calc(100vh - 330px);
}
</style>
