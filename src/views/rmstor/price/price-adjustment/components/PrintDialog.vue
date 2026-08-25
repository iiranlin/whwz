<template>
  <ep-dialog class="ep-dialog-list" title="打印" v-model="visible" width="1100px" top="5vh" append-to-body>
    <div class="dialog-printMe" id="printMe">
      <div v-for="item in tableData" :key="item.id" class="content-weapper">
        <h1 class="printMe-h1">物资调价单</h1>
        <div class="content-weapper-qc">
          <qr-code-component :text="item.adjustCode" :size="80" />
        </div>
        <table cellpadding="10" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td class="td" colspan="4" style="margin-left: 15px;">&nbsp;&nbsp;第：{{ item.adjustCode }}
                &nbsp;&nbsp;&nbsp;&nbsp;号</td>
              <td class="td" colspan="4">打印日期：{{ parseTime(new Date().getTime(), "{y}年{m}月") }}</td>
            </tr>
            <tr>
              <td class="td" colspan="4">&nbsp;&nbsp;地区：{{ item.plantName }}</td>
              <td class="td" colspan="4">仓库：{{ item.depotName }}</td>
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
              <tr v-for="(d, index) in item.adjustPriceDtDTOList" :key="d.id" style="text-align: center;">
                <td>{{ index + 1 }}</td>
                <td>{{ d.matlCode }}</td>
                <td style="text-align: left;">{{ d.matlName }} &nbsp;&nbsp;{{ d.matlType }}</td>
                <td>{{ d.matlUnit }}</td>
                <td>{{ d.prPrice }}</td>
                <td>{{ d.ptPrice }}</td>
                <td>{{ d.num }}</td>
                <td>{{ d.profitAmount }}</td>
              </tr>
              <tr>
                <td></td>
                <td colspan="6" style="text-align: right;">合计：</td>
                <td style="text-align: center;">{{ sum(item.adjustPriceDtDTOList) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <table cellpadding="10" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td class="td">&nbsp;&nbsp;制单人：{{ item.bmName }}</td>
              <td class="td" colspan="4">审批人：{{ item.approver }}</td>
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
import { rmstorInternalprintList } from '@/api/rmstor/price-adjustment'

const { proxy } = getCurrentInstance()

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
    return item.profitAmount
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