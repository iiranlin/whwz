<!-- 供货单打印弹窗（v-print 浏览器打印） -->
<template>
  <ep-dialog class="ep-dialog-list" title="打印" v-model="visible" width="1000px" top="5vh" append-to-body>
    <div class="dialog-printMe" id="printMe" v-loading="loading">
      <div v-if="orderData.pdmId" class="content-weapper">
        <h1 class="printMe-h1">供货单</h1>
        <table cellpadding="8" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td class="td" colspan="4">采购订单号：{{ orderData.spdCode }}</td>
              <td class="td" colspan="4">供应商：{{ orderData.suName }}</td>
            </tr>
            <tr>
              <td class="td" colspan="2">用料地区：{{ orderData.plantName }}</td>
              <!-- <td class="td" colspan="2">计划周期：{{ orderData.rptAccptdtName }}</td> -->
              <td class="td" colspan="2">采购方式：{{ orderData.purcTypeName }}</td>
              <td class="td" colspan="2">制单日期：{{ parseTime(orderData.makeDate, '{y}-{m}-{d}') }}</td>
            </tr>
            <tr>
              <td class="td" colspan="8">备注：{{ orderData.comments }}</td>
            </tr>
          </tbody>
        </table>
        <div class="article__heading__table">
          <table cellpadding="8" cellspacing="0" width="100%">
            <thead>
              <tr>
                <th style="width: 5%;">序号</th>
                <th>物资编号</th>
                <th>物资名称</th>
                <th>规格型号</th>
                <th>计量单位</th>
                <th>数量</th>
                <th>单价(元)</th>
                <th>采购金额(元)</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(d, index) in orderData.details || []" :key="d.pddId">
                <td style="text-align: center;">{{ index + 1 }}</td>
                <td style="text-align: center;">{{ d.smatlCode }}</td>
                <td style="text-align: center;">{{ d.smatlName }}</td>
                <td style="text-align: center;">{{ d.smatlType }}</td>
                <td style="text-align: center;">{{ d.smatlUnit }}</td>
                <td style="text-align: center;">{{ format4(d.purNum) }}</td>
                <td style="text-align: center;">{{ format2(d.contPrice) }}</td>
                <td style="text-align: center;">{{ format2(d.purAmount) }}</td>
                <td style="text-align: center;">{{ d.comments }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <table cellpadding="8" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td class="td" colspan="4">合计金额：{{ format2(orderData.consAmount) }}</td>
              <td class="td" colspan="4">制单人：{{ orderData.userName }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button type="primary" class="determine-btn" v-print="printSetting"><svg-icon icon-class="determine" />&nbsp;打印</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup name="self-supply-order-print">
import { getOrderMtDetail } from '@/api/warehouse/selfSupplyOrder'
import { parseTime } from '@/utils/generalMethod'

const visible = ref(false)
const loading = ref(false)
const orderData = ref({})

const printSetting = ref({
  id: 'printMe',
})

function show(row) {
  visible.value = true
  getDetail(row)
}

function getDetail(row) {
  loading.value = true
  getOrderMtDetail(row.pdmId).then(({ data }) => {
    orderData.value = data || {}
  }).finally(() => {
    loading.value = false
  })
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
@media print {
  @page {
    margin: 0cm;
  }
  .content-weapper {
    page-break-before: always;
  }
}
.dialog-printMe {
  width: 100%;
  padding: 0 10px;
  overflow: auto;
}
.printMe-h1 {
  text-align: center;
  padding-bottom: 20px;
}
.content-weapper {
  position: relative;
}
.article__heading__table {
  width: 100%;

  table {
    border-top: 1px solid #000;
    border-left: 1px solid #000;

    th,
    td {
      border-right: 1px solid #000;
      border-bottom: 1px solid #000;
      color: #000;
    }
  }
}
</style>
