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
              <td class="td" colspan="3">单位：{{ item.unitName }}</td>
              <td class="td" colspan="3"><pre>第    {{ item.ibBillCode }}    号</pre></td>
            </tr>
            <tr>
              <td class="td" colspan="3">用料地区：{{ item.plantName }}</td>
              <td class="td" colspan="2">制单日期：{{ parseTime(item.orderDate, "{y}-{m}-{d}") }}</td>
              <td class="td" colspan="2">发票号：{{ item.invoiceCode }}</td>
            </tr>
            <tr>
              <td class="td" colspan="3">仓库：{{ item.depotName }}</td>
              <!-- <td class="td" colspan="2">收料类别：{{ whReceiptSourceObj[item.ibSource] }}</td> -->
              <td class="td" colspan="2">运费：{{ item.freightAmount != null ? Number(item.freightAmount).toFixed(2) : '' }}</td>
              <td class="td" colspan="1">杂费：{{ item.extrasAmount != null ? Number(item.extrasAmount).toFixed(2) : '' }}</td>
              <td class="td" colspan="1">税额：{{ item.incotaxAmount != null ? Number(item.incotaxAmount).toFixed(2) : '' }}</td>
            </tr>
            <tr>
              <td class="td" colspan="3">供应商：{{ item.supUnitName }}</td>
              <td class="td" colspan="3">供货单号：{{ item.refBillCode }}</td>
            </tr>
            <tr>
              <td colspan="10">备注：{{ item.comments }}</td>
            </tr>
          </tbody>
        </table>
        <div class="article__heading__table">
          <table cellpadding="10" cellspacing="0" width="100%" show-summary>
            <thead>
              <tr>
                <th class="th" key="index" style="width: 6%;">序号</th>
                <th class="th" v-for="j in printMatlTableJson" :key="j.key" :style="{ width: j.width }">{{ j.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(d, index) in item.inBoundDts" :key="d.ibdtId">
                <td class="td" key="index" style="text-align: center; width: 6%;" >{{ index + 1 }}</td>
                <td class="td" v-for="val in printMatlTableJson" :key="val.key" :style="{ textAlign: 'center', width: val.width }">
                  {{ val.prop === 'matlName' ? `${d.matlName}${d.matlType ? '/' + d.matlType : ''}` : val.formatter ? val.formatter(d[val.prop]) : d[val.prop] }}
                </td>
              </tr>
              <tr key="sum">
                <td style="text-align: center;" colspan="2"></td>
                <td style="text-align: center;" colspan="3">采购金额</td>
                <td style="text-align: center;"></td>
                <td style="text-align: center;">{{ sumCount(item.inBoundDts || [], 'stkAmount').toFixed(2) }}</td>
                <td style="text-align: center;">入库金额</td>
                <td style="text-align: center;">{{ sumCount(item.inBoundDts || [], 'standardAmount').toFixed(2) }}</td>
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
        <el-button type="primary" class="determine-btn" v-print="printSetting"><svg-icon icon-class="determine" />&nbsp;打印</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import QrCodeComponent from '@/components/QrCodeComponent';
import { printMatlTableJson } from "../tableJson"
import { batchGetInbound } from '@/api/rmstor/inbound';
// import { mainPrint } from '@/api/warehouse/externalTransfer'
import { whReceiptSourceObj } from "@/utils/dictionary.js";

const { proxy } = getCurrentInstance()

const visible = ref(false)
const tableData = ref([{}])
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

const getMainPrint = (ids) => {
  proxy.$modal.loading()
  batchGetInbound(ids).then(({ data }) => {
    tableData.value = data || []
  }).finally(() => {
    proxy.$modal.closeLoading()
  })
}

const sumCount = (items, prop) => {
  let amountSum = items.map((item => {
    return item[prop]
  }))
  return amountSum?.reduce((a, b) =>
    a + b, 0)
}

// 显示弹框
function show(ids) {
  visible.value = true
  getMainPrint(ids)
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
.dialog-printMe{
  width: 100%;
  padding: 0 10px;
  overflow: auto;
}
.printMe-h1 {
  text-align: center;
  padding-bottom: 20px;
}

.content-weapper{
  position: relative;
}

:deep(.content-weapper-qc){
  position: absolute;
  right: 50px;
  top: 0;
}

.article__heading__table {
  width: 100%;

  table {
    table-layout: fixed;
    width: 100%;
    border-top: 1px solid #000;
    border-left: 1px solid #000;

    th,
    td {
      border-right: 1px solid #000;
      border-bottom: 1px solid #000;
      color: #000;
      word-break: break-all;
    }
  }
}
</style>