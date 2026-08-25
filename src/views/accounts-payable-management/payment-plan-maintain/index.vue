<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <form-data ref="formDataRef" :queryParams="queryParams" :showSearch="showSearch" :formJson="formJson" @handleQuery="handleQuery" @handleSelectChange="handleSelectChange" :formSelectData="formSelectData"
          @resetQuery="resetQuery" labelWidth="140"></form-data>
        <button-top :buttonJson="tableButtonJson" @handleButton="handleButtonClick" :buttonDisable="handleButtonDisable">
          <right-toolbar v-model:showSearch="showSearch" :tableJson="tableJsonArr" @queryTable="getList" @tabConfigSuccess="tabConfigSuccess"></right-toolbar>
        </button-top>
        <!-- 表格数据 -->
        <table-index class="table-index" :loading="loading" :idName="idName" :queryParams="queryParams" :tableJson="tableJsonArr" :tableButtonJson="tableButtonJson"
          :tableData="tableData" @handleSelectionChange="handleSelectionChange" operationWidth="160" :buttonDisable="handleButtonDisable" :tableDataDict="tableDataDict"
          @handleButtonClick="handleButtonClick" @clickLink="handleClickLink">
          <template #payedPercent="{ scope }">
            <el-input v-model="scope.row.payedPercent" v-number-input v-if="scope.row.status == '0'"></el-input>
            <span v-else>{{ scope.row.payedPercent }}</span>
          </template>
          <template #payedAmount="{ scope }">
            <el-input v-model="scope.row.payedAmount" v-number-input.float="2" v-if="scope.row.status == '0'"></el-input>
            <span v-else>{{ scope.row.payedAmount }}</span>
          </template>
          <template #remainPayedAmount="{ scope }">
            <span>{{ (scope.row.sumAmount - scope.row.sumPayedAmount).toFixed(2) }}</span>
          </template>
        </table-index>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize" @pagination="getList" />

      </el-col>
    </el-row>

    <details-dialog ref="detailsDialog" idName="planMtId" />
    <record-dialog ref="recordDialog" />
    
  </div>
</template>

<script setup name="payment-plan-maintain">
import { formJson } from "./formJson"
import { tableJson, tableButtonJson } from "./tableJson"
import { getLocalStorage } from '@/utils/auth'
import { prePayPlanDtGetPayPlanDts, prePayPlanDtDraftPayAmount, prePayPlanDtSubmitPayAmount } from '@/api/warehouse/prePayPlanDt'
import DetailsDialog from "@/views/accounts-payable-management/wait-payment-plan-generate/components/detailsDialog"
import RecordDialog from "./components/recordDialog"

const { proxy } = getCurrentInstance()

const tableJsonArr = ref(JSON.parse(getLocalStorage(proxy.$route.meta?.menuId)) || tableJson)
const tableData = ref([])
const loading = ref(false)
const showSearch = ref(true)
const idName = ref('id')
const ids = ref([])
const selectionData = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    pageType: '0'
  },
  formSelectData: {
  },
  tableDataDict: {}
})

const { queryParams, formSelectData, tableDataDict } = toRefs(data)

const tabConfigSuccess = (data) => {
  tableJsonArr.value = data
}

const handleButtonDisable = (code, row) => {
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
  loading.value = true
  prePayPlanDtGetPayPlanDts(params).then(({ data }) => {
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

const isStatusFun = (code = '', name = '') => {
  const isFlag = selectionData.value.some(a => a.status != code)
  if(isFlag){
    proxy.$modal.msgWarning(name)
    return false
  }
  return true
}

const handleCreate = () => {
  if(isIdsFun() && isStatusFun('0', '单据状态为已提交，不允许保存')){
    proxy.$modal.confirm('您确定要保存所选待付款计划单吗？').then(() => {
      return prePayPlanDtDraftPayAmount(selectionData.value)
    }).then(({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handleSubmit = () => {
  if(isIdsFun() && isStatusFun('0', '单据状态为已提交，不允许提交')){
    proxy.$modal.confirm('您确定要提交所选待付款计划单吗？').then(() => {
      return prePayPlanDtSubmitPayAmount(selectionData.value)
    }).then(({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handleButtonClick = (code, data) => {
  const eventObj = {
    // 保存
    create: () => {
      handleCreate()
    },
    // 提交
    submit: () => {
      handleSubmit()
    },
    viewMatl: () => {
      proxy.$refs.recordDialog.show(data?.row)
    },
  }
  eventObj[code] && eventObj[code]()
}

const handleClickLink = (code, data) => {
  const eventObj = {
    // 详情
    prePayPlanCode: () => {
      proxy.$refs.detailsDialog.show(data)
    }
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>