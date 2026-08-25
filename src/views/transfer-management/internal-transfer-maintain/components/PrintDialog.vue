<template>
  <ep-dialog class="ep-dialog-list" title="打印" v-model="visible" width="1100px" top="5vh" append-to-body>
    <div class="dialog-printMe" id="printMe">
      <div v-for="item in tableData" :key="item.id" class="content-weapper">
        <h1 class="printMe-h1">移库单</h1>
        <div class="content-weapper-qc">
          <qr-code-component :text="item.billCode || ''" :size="80" />
        </div>
        <table cellpadding="10" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td class="td" colspan="4">单位名称：{{ item.unitName }}</td>
              <td class="td" colspan="4">移库单号：{{ item.billCode }}</td>
            </tr>
            <tr>
              <td class="td" colspan="2">移出地区：{{ item.prePlantName }}</td>
              <td class="td" colspan="2">移出仓库：{{ item.preWhName }}</td>
              <td class="td" colspan="2">移出仓库分区：{{ item.prePartitionName }}</td>
            </tr>
            <tr>
              <td class="td" colspan="2">移入地区：{{ item.ptPlantName }}</td>
              <td class="td" colspan="2">移入仓库：{{ item.ptWhName }}</td>
              <td class="td" colspan="2">移入仓库分区：{{ item.ptPartitionName }}</td>
            </tr>
            <tr>
              <td class="td" colspan="2">下单日期：{{ parseTime(item.makeDate, "{y}-{m}-{d}") }}</td>
              <td class="td" colspan="2">出库日期：{{ parseTime(item.outDate, "{y}-{m}-{d}") }}</td>
            </tr>
            <tr>
              <td class="td" colspan="8">备注：{{ item.comments }}</td>
            </tr>
          </tbody>
        </table>
        <div class="article__heading__table">
          <table cellpadding="10" cellspacing="0" width="100%">
            <thead>
              <tr>
                <th style="width: 5%;">序号</th>
                <th class="th" v-for="j in printMatlTableJson" :key="j.key">{{ j.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(d, index) in item.dts" :key="d.id">
                <td style="text-align: center;">{{ index+1 }}</td>
                <td class="td" v-for="val in printMatlTableJson" :key="val.key" style="text-align: center;">{{ val.prop === 'matlName'?`${d.matlName}${d.matlType?'/'+d.matlType:''}` : d[val.prop]}}</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style="text-align: right;">合计：</td>
                <td class="td" style="text-align: center;">{{ item.tsSumAmount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <table cellpadding="10" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td class="td">发料人：{{ item.preDmName }}</td>
              <td class="td">收料人：{{ item.ptDmName }}</td>
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
import QrCodeComponent from '@/components/QrCodeComponent'
import { printMatlTableJson } from "../tableJson"
import { rmstorInternalPrintList } from '@/api/warehouse/rmstorInternal'

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
  rmstorInternalPrintList(ids).then(({ data }) => {
    tableData.value = data || []
  }).finally(() => {
    proxy.$modal.closeLoading()
  })
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