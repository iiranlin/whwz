<template>
  <ep-dialog class="ep-dialog-list" title="打印" v-model="visible" width="1100px" top="5vh" append-to-body>
    <div class="dialog-printMe" id="printMe">
      <div class="content-weapper">
        <h1 class="printMe-h1">出&nbsp;&nbsp;库&nbsp;&nbsp;单<p class="printMe-p">{{ rowObj.taxFlagName }}项目</p></h1>
        <div class="content-weapper-qc">
          <qr-code-component :text="rowObj.obBillCode || ''" :size="80" />
        </div>
        <table cellpadding="10" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td class="td" colspan="2"><label class="td-label">单位：</label>{{ rowObj.unitName }}</td>
              <td class="td" colspan="2">第&nbsp;&nbsp;{{ rowObj.obBillCode }}&nbsp;&nbsp;号</td>
            </tr>
            <tr>
              <td class="td" colspan="2"><label class="td-label">领料地区：</label>{{ rowObj.plantName }}</td>
              <td class="td" colspan="2"><label class="td-label">发料日期：</label>{{ parseTime(rowObj.orderDate, "{y}-{m}-{d}") }}</td>
            </tr>
            <tr>
              <td class="td" colspan="2"><label class="td-label">仓库：</label>{{ rowObj.depotName }}</td>
              <td class="td" colspan="2"><label class="td-label">领料部门：</label>{{ rowObj.teamName }}</td>
            </tr>
          </tbody>
        </table>
        <div class="article__heading__table">
          <table cellpadding="10" cellspacing="0" width="100%">
            <thead>
              <tr>
                <th class="th" style="width: 5%;">序号</th>
                <th class="th" v-for="j in printMatlTableJson" :key="j.key" :style="`width: ${j.width}%`">{{ j.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(d, index) in rowObj.dtList" :key="d.qibdtId">
                <td class="td" style="text-align: center;width: 5%;">{{ index+1 }}</td>
                <td class="td" v-for="val in printMatlTableJson" :key="val.key" :style="`text-align: ${val.align}; width: ${val.width}%`">{{ val.prop === 'matlName'?`${d.matlName}${d.matlType?'/'+d.matlType:''}` : d[val.prop]}}</td>
              </tr>
              <tr>
                <td class="td" style="text-align: center; width: 5%;">备注</td>
                <td class="td" style="width: 5%;" colspan="4"></td>
                <td class="td" style="text-align: right">合计</td>
                <td class="td" style="text-align: right">{{ rowObj.totalAmount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <table cellpadding="10" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td class="td">请领人：</td>
              <td class="td">业务员：{{ rowObj.bmName }}</td>
              <td class="td">仓库员：{{ rowObj.dmName }}</td>
              <td class="td">财务员：</td>
              <td class="td">收料人：</td>
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
import { obmtGetDetail } from '@/api/warehouse/obmt'

const { proxy } = getCurrentInstance()

const visible = ref(false)
const rowObj = ref({})
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

const getObmtGetDetail = (id) => {
  proxy.$modal.loading()
  obmtGetDetail(id).then(({ data }) => {
    rowObj.value = data || {}
  }).finally(() => {
    proxy.$modal.closeLoading()
  })
}

// 显示弹框
function show(id) {
  visible.value = true
  getObmtGetDetail(id)
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
    .td-label{
      width: 80px !important;
    }
  }
  .printMe-p {
    top: 10px !important;
    left: 330px !important;
  }
}
.dialog-printMe{
  width: 100%;
  padding: 0 10px;
  overflow: auto;
}
.printMe-h1 {
  position: relative;
  text-align: center;
  padding-bottom: 20px;
  width: 510px;
  margin: 16px auto;
  .printMe-p {
    position: absolute;
    border: 1px solid #000;
    padding: 2px 5px;
    margin: 0;
    top: 6px;
    left: 320px;
    font-size: 14px;
  }
}

.content-weapper{
  position: relative;
  .td-label{
    display: inline-block;
    width: 70px;
    text-align: right;
    font-weight: 400;
  }
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