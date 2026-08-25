<template>
  <ep-dialog class="ep-dialog-list" title="打印" v-model="visible" width="1100px" top="5vh" append-to-body>
    <div class="dialog-printMe" id="printMe">
      <div v-for="item in tableData" :key="item.id" class="content-weapper">
        <h1 class="printMe-h1">入库单</h1>
        <div class="content-weapper-qc">
          <qr-code-component :text="item.ibBillCode" :size="80" />
        </div>
        <table cellpadding="10" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td class="td" colspan="0" style="margin-left: 15px;">单位名称：{{ item.unitName }}</td>
              <td class="td" colspan="0" style="margin-left: 10px;">第：{{ item.ibBillCode }}
                &nbsp;&nbsp;号</td>
            </tr>
            <tr>
              <td class="td" >用料地区：{{ item.plantName }}</td>
              <td class="td" >制单日期：{{ parseTime(item.orderDate, "{y}-{m}-{d}") }}</td>
              <td class="td" >发票号：{{ item.invoiceCode }}</td>
            </tr>
              <tr>
              <td class="td" >库位名称：{{ item.depotName }}</td>
              <td class="td" >收料类别：{{whReceiptSourceObj[item.ibSource] }}</td>
              <td class="td" >运费：{{ item.freightAmount }}</td>
              <td class="td" >杂费：{{ item.extrasAmount }}</td>
              <td class="td" >税额：{{ item.incotaxAmount }}</td>
            </tr>
            <tr>
              <td class="td" >供应单位：{{ item.supUnitName }}</td>
              <td class="td" >供货单号/订单号：{{ item.supUnitCode }}</td>
            </tr>
              <tr>
              <td class="td" colspan="4">备注：{{ item.comments }}</td>
            </tr>
          </tbody>
        </table>
        <div class="article__heading__table">
          <table cellpadding="10" cellspacing="0" width="100%">
            <thead>
              <tr>
                <th class="th" v-for="(j, index) in printMatlTableJson" :key="j.key">{{ j.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(d, index) in item.inBoundDts" :key="index" style="text-align: center;">
                <td>{{ index + 1 }}</td>
                <td>{{ d.matlCode }}</td>
                <td>{{ `${d.matlName} ${d.matlType}` }}</td>
                <td>{{ d.matlUnit}}</td>
                <td>{{ d.paNum }}</td>
                <td>{{ d.stkPrice }}</td>
                <td>{{ d.stkAmount }}</td>
                <td>{{ d.cardPrice }}</td>
                 <td>{{ d.standardAmount }}</td>
              </tr>
              <tr>
                <td></td>
                <td colspan="2"> </td>
                <td style="text-align: right;"  colspan="3">采购金额：</td>
                <td style="text-align: center;">{{ sum(item.inBoundDts) }}</td>
                <td style="text-align: right;">入库金额：</td>
                <td style="text-align: center;">{{ sum2(item.inBoundDts) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <table cellpadding="10" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td class="td">制单人：{{ item.bmName }}</td>
              <td class="td">收料人：{{ item.dmName }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button type="primary" class="determine-btn" v-print="printSetting"><svg-icon
            icon-class="determine" />&nbsp;打印</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import QrCodeComponent from '@/components/QrCodeComponent'
import { printMatlTableJson } from "../tableJson"
import { rmstorInternalprintList } from '@/api/rmstor/steel-inbound'
const { proxy } = getCurrentInstance()
import { whReceiptSourceObj } from "@/utils/dictionary.js";

const visible = ref(false)
const tableData = ref([])
const printSetting = ref({
  id: 'printMe',
  beforeOpenCallback(vue) {
    vue.pringLoading = true
  },
  openCallback(vue) {

  },
  closeCallback(vue) {
    vue.pringLoading = false
  }
})
const getRmstorInternalPrintList = (ids) => {
  proxy.$modal.loading()
  rmstorInternalprintList(ids).then(({ data }) => {
    tableData.value = data || []
  }).finally(() => {
    proxy.$modal.closeLoading()
  })
}
const sum = (items) => {
  let amountSum = items.map((item => {
    return item.stkAmount
  }))
  return amountSum?.reduce((a, b) =>
    a + b, 0)
}
const sum2= (items) => {
  let amountSum = items.map((item => {
    return item.standardAmount
  }))
  return amountSum?.reduce((a, b) =>
    a + b, 0)
}
// 显示弹框
function show(ids) {
  visible.value = true
  getRmstorInternalPrintList(ids)
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

:deep(.content-weapper-qc) {
  position: absolute;
  right: 50px;
  top: 0;
}

.article__heading__table {
  width: 100%;
  margin-top: 10px;

  table {
    border-top: 1px solid #000;
    border-left: 1px solid #000;

    .td {
      width: 14%;
    }

    th,
    td {
      border-right: 1px solid #000;
      border-bottom: 1px solid #000;
      color: #000;
    }
  }
}
</style>