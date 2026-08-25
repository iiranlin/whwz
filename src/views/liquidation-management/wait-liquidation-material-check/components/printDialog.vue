<template>
  <ep-dialog class="ep-dialog-list" title="打印" v-model="visible" width="1350px" top="5vh" append-to-body>
    <div class="dialog-printMe" id="printMe" v-if="visible">
      <div class="content-weapper" v-for="data in tableData" :key="data.id">
        <h1 class="printMe-h1"><span class="printMe-h1-span">{{ parseTime(new Date(), "{y}年{m}月") }}</span><span class="printMe-h1-title">{{ title }}</span></h1>
        <div class="article__heading__table">
          <table class="wireless_table" cellpadding="10" cellspacing="0" width="100%">
            <thead>
              <tr v-if="title == '结算物资明细'">
                <th style="width: 4%;">采供单位名称：{{ getCookie('unitName') }}</th>
                <th style="width: 2%;">供应商编码：{{ data.supplierCode }}</th>
                <th style="width: 5%;">供应商名称：{{ data.supplierName }}</th>
                <th style="width: 5%;">结算金额(元)：{{ data.sumAmount }}</th>
              </tr>
              <tr v-else>
                <th>采供单位名称：{{ getCookie('unitName') }}</th>
                <th>用料单位编码：{{ data.useUnitCode }}</th>
                <th>用料单位名称：{{ data.useUnitName }}</th>
                <th>清算金额(元)：{{ data.sumAmount }}</th>
              </tr>
            </thead>
          </table>
          <table cellpadding="10" cellspacing="0" width="100%">
            <thead>
              <tr>
                <th>序号</th>
                <th v-for="j in tableJson || printMatlTableJson" :key="j.key">{{ j.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in data.dts" :key="item.id">
                <td style="text-align: center;">{{ index+1 }}</td>
                <td style="text-align: center;" v-for="val in tableJson || printMatlTableJson" :key="val.key">
                  <span v-if="val.prop == 'useUnitName'">{{ data[val.prop] }}</span>
                  <span v-else-if="val.type == 'date'">{{ parseTime(item[val.prop], "{y}/{m}/{d}") }}</span>
                  <span v-else>{{ item[val.prop] }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
import { printMatlTableJson } from "../tableJson"
import { getCookie } from '@/utils/auth'

const { proxy } = getCurrentInstance()

// 接收参数并指定类型（可选）
const props = defineProps({
  title: {
    type: String,
    default: '结算物资明细'
  },
  tableJson: {
    type: Array,
    default: null
  },
  apiUrl: {
    type: Function,
    default: null
  }
})

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

/** 查询列表 */
function getList(ids) {
  if(props.apiUrl){
    proxy.$modal.loading()
    props.apiUrl({mtIds: ids}).then(({ data }) => {
      tableData.value = data || []
    }).finally(() => {
      proxy.$modal.closeLoading()
    })
  }
}

// 显示弹框
function show(ids) {
  visible.value = true
  getList(ids)
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
@media print {
  @page {
    margin: 0.1cm 0.4cm 0.1cm 0.4cm;
  }
  .dialog-printMe {
    zoom: 60%;
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
  .printMe-h1-title{
    padding-right: 160px;
  }
  .printMe-h1-span{
    padding-right: 10px;
  }
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

    th,
    td {
      border-right: 1px solid #000;
      border-bottom: 1px solid #000;
      color: #000;
      width: 5%;
    }
  }
  .wireless_table{
    border-top: none;
    border-left: none;
    th{
      border-right: none;
      border-bottom: none;
      text-align: left;
    }
  }
}
</style>