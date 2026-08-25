<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <form-data ref="formDataRef" :showSearch="showSearch" :formJson="formJson" @handleQuery="handleQuery" @handleSelectChange="handleSelectChange" :formSelectData="formSelectData"
          @resetQuery="resetQuery" labelWidth="140"></form-data>
        <button-top :buttonJson="radioButton == menuIdMain?tableButtonJson:detailsTableButtonJson" @handleButton="handleButtonClick" :buttonDisable="handleButtonDisable">
          <right-toolbar v-model:showSearch="showSearch" :menuId="radioButton" :tableJson="tableJsonArr" @queryTable="getList" @tabConfigSuccess="tabConfigSuccess"></right-toolbar>
        </button-top>
        <el-radio-group v-model="radioButton" @change="radioButtonChange">
          <el-radio-button v-for="item in radioButtonData" :label="item.label" :value="item.value" :key="item.value"></el-radio-button>
        </el-radio-group>
        <!-- 表格数据 -->
        <table-index class="table-index" :loading="loading" :idName="idName" :selectionShow="radioButton == menuIdMain" :queryParams="queryParams" :tableJson="tableJsonArr"
          :tableButtonJson="radioButton == menuIdMain?tableButtonJson:detailsTableButtonJson"
          :tableData="tableData" @handleSelectionChange="handleSelectionChange" operationWidth="160" :buttonDisable="handleButtonDisable" :tableDataDict="tableDataDict"
          @handleButtonClick="handleButtonClick" @clickLink="handleClickLink">
          <template #onlyTaxAmount="{ scope }">
            <span>{{ (scope.row.taxAmount - scope.row.noTaxAmount).toFixed(2) }}</span>
          </template>
        </table-index>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize" @pagination="getList" />

      </el-col>
    </el-row>
    <details-dialog ref="detailsDialog" />
    <print-dialog ref="printDialog" title="清算物资明细" :tableJson="printMatlTableJson" :apiUrl="printNoticeMtWithDt" />
    <saveInvoiceFiles ref="saveInvoiceFiles" />
  </div>
</template>

<script setup name="liquidation-notification-query">
import { formJson } from "./formJson"
import { tableJson, tableButtonJson, detailsTableJson, printMatlTableJson, detailsTableButtonJson } from "./tableJson"
import { getLocalStorage } from '@/utils/auth'
import { prePayNoticeList, prePayNoticeDeleteBatch, printNoticeMtWithDt, getNoticeDtWithInvoice } from '@/api/warehouse/prePay'
import DetailsDialog from "./components/detailsDialog"
import PrintDialog from "@/views/liquidation-management/wait-liquidation-material-check/components/printDialog"
import SaveInvoiceFiles from "@/views/liquidation-management/wait-liquidation-material-check/components/saveInvoiceFiles"

const { proxy } = getCurrentInstance()
const tableData = ref([])
const loading = ref(false)
const showSearch = ref(true)
const idName = ref('id')
const ids = ref([])
const selectionData = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const menuIdMain = ref(proxy.$route.meta?.menuId+'main')
const radioButton = ref(menuIdMain.value)
const tableJsonArr = ref(JSON.parse(getLocalStorage(radioButton)) || tableJson)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
  },
  formSelectData: {
  },
  tableDataDict: {},
  radioButtonData: [
    {label: '主单', value: proxy.$route.meta?.menuId+'main'},
    {label: '主单+明细', value: proxy.$route.meta?.menuId+'details'},
  ]
})

const { queryParams, formSelectData, tableDataDict, radioButtonData } = toRefs(data)

const radioButtonChange = () => {
  tableJsonArr.value = JSON.parse(getLocalStorage(radioButton)) || (radioButton.value == menuIdMain.value?tableJson:detailsTableJson)
  getList()
}

const tabConfigSuccess = (data) => {
  tableJsonArr.value = data
}

const handleButtonDisable = (code, row) => {
  if(['check'].includes(code) && row.status == '2'){
    return false
  }
  return true
}

const handleSelectChange = (code, value) => {
  const eventObj = {
  }
  eventObj[code] && eventObj[code]()
}

/** 查询列表 */
function getList() {
  const params = proxy.addDateRange(queryParams.value, queryParams.value.createDate, 'createDate')
  const url = radioButton.value == menuIdMain.value?prePayNoticeList:getNoticeDtWithInvoice
  loading.value = true
  url(params).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

/** 搜索按钮操作 */
function handleQuery(data) {
  queryParams.value.pageNum = 1
  queryParams.value = Object.assign({}, queryParams.value, data)
  getList()
}

/** 重置按钮操作 */
function resetQuery(data) {
  handleQuery(data)
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  selectionData.value = selection
  ids.value = selection.map(item => item[idName.value])
  single.value = selection.length != 1
  multiple.value = !selection.length
}

const isIdsFun = () => {
  if(!ids.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return false
  }
  return true
}

const handleDelete = () => {
  if(isIdsFun()){
    proxy.$modal.confirm('确定要删除吗？').then(()=>{
      return prePayNoticeDeleteBatch({ids: ids.value})
    }).then( ({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handleButtonClick = (code, data) => {
  const eventObj = {
    print: () => {
      if(isIdsFun()){
        proxy.$refs.printDialog.show(ids.value)
      }
    },
    delete: () => {
      handleDelete()
    },
    // 查看发票附件
    viewInvoice: () => {
      proxy.$refs.saveInvoiceFiles.show('viewInvoice', [data?.row.pddId])
    }
  }
  eventObj[code] && eventObj[code]()
}

const handleClickLink = (code, data) => {
  const eventObj = {
    // 详情
    prePayNoticeNo: () => {
      proxy.$refs.detailsDialog.show(data, radioButton.value == menuIdMain.value?'id':'noticeMtId')
    }
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>
<style lang="scss" scoped>
.ep-radio-group{
  margin-bottom: 5px;
  .is-active{
    :deep(.ep-radio-button__inner){
      background-color: #64a1ff !important;
      border-color: #64a1ff !important;
    }
  }
}
</style>