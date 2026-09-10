<template>
  <ep-dialog class="ep-dialog-list" title="打印" v-model="visible" width="1100px" top="5vh" append-to-body>
    <div class="dialog-printMe" id="printMe">
      <div v-for="item in tableData" :key="item.id" class="content-weapper">
        <h1 class="printMe-h1">出库单</h1>
        <div class="content-weapper-qc">
          <qr-code-component :text="item.obCode" :size="80" />
        </div>
        <table cellpadding="10" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td class="td" colspan="4" style="margin-left: 15px;">单位：{{ item.unitName }}</td>
              <td class="td" colspan="4" style="margin-left: 15px;">领料部门：{{ item.teamName }}</td>
              <td class="td" colspan="4" style="margin-left: 10px;">第：{{ item.obCode }}
                &nbsp;&nbsp;号</td>
            </tr>
            <tr>
              <td class="td" colspan="4" style="margin-left: 15px;">用料地区：{{ item.plantName }}</td>
              <td class="td" colspan="4" style="margin-left: 15px;">单台设备：{{ item.idsName }}</td>
              <td class="td" colspan="4" style="margin-left: 15px;">制单日期：{{ parseTime(new Date(), "{y}-{m}-{d}") }}
              </td>
            </tr>
            <tr>
              <td class="td" colspan="4">仓库：{{ item.depotName }}</td>
              <!-- <td class="td" colspan="4">部件号：{{ item.iddCode }}</td> -->
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
              <tr v-for="(d, index) in item.rmstorOutBoundDtDTOList" :key="index" style="text-align: center;">
                <td>{{ index + 1 }}</td>
                <td>{{ d.matlCode }}</td>
                <td>{{ `${d.matlName} ${d.matlType}` }}</td>
                <td>{{ d.matlUnit }}</td>
                <td>{{  d.outNum != null ? Number(d.outNum).toFixed(4) : '' }}</td>
                <td>{{  d.price != null ? Number(d.price).toFixed(2) : '' }}</td>
                <td>{{  d.outAmount != null ? Number(d.outAmount).toFixed(2) : '' }}</td>
              </tr>
              <tr>
                <td style="text-align: center;">备注</td>
                <td colspan="4" style="text-align: left;">{{ item.comments }} </td>
                <td style="text-align: right;">合计：</td>
                <td style="text-align: center;">{{ sum(item.rmstorOutBoundDtDTOList).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <table cellpadding="10" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <!-- <td class="td">请领人：{{ item.pleaseLeaduser }}</td> -->
              <td class="td">制单人：{{ item.makerName }}</td>
              <td class="td">发料人：{{ item.noteName }}</td>
              <td class="td">收料人：{{ item.receiveName }}</td>
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
import { rmstorInternalprintList } from '@/api/rmstor/outbound-maintenance'
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
    return item.outAmount
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