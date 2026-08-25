<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <form-data ref="formDataRef" :showSearch="showSearch" :formJson="formJson" @handleQuery="handleQuery" @handleSelectChange="handleSelectChange" :formSelectData="formSelectData"
          @resetQuery="resetQuery" labelWidth="120"></form-data>
        <button-top :buttonJson="tableButtonJson" @handleButton="handleButtonClick" :buttonDisable="handleButtonDisable">
          <right-toolbar v-model:showSearch="showSearch" :tableJson="tableJsonArr" @queryTable="getList" @tabConfigSuccess="tabConfigSuccess"></right-toolbar>
        </button-top>
        <!-- 表格数据 -->
        <table-index class="table-index" :loading="loading" :idName="idName" :queryParams="queryParams" :tableJson="tableJsonArr" :tableButtonJson="tableButtonJson"
          :tableData="tableData" @handleSelectionChange="handleSelectionChange" operationWidth="160" :buttonDisable="handleButtonDisable" :tableDataDict="tableDataDict"
          @handleButtonClick="handleButtonClick" @clickLink="handleClickLink">
          <template #remainingAmount="{ scope }">
            <span>{{ (scope.row.sumAmount - scope.row.sumPayedAmount).toFixed(2) }}</span>
          </template>
        </table-index>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize" @pagination="getList" />

      </el-col>
    </el-row>

    <details-dialog ref="detailsDialog" />
    <matlDialog ref="matlDialog" />
    
  </div>
</template>

<script setup name="wait-payment-plan-generate">
import { formJson } from "./formJson"
import { tableJson, tableButtonJson } from "./tableJson"
import { getLocalStorage } from '@/utils/auth'
import { prePayPlanCreate, prePayPlanList, prePayPlanDeleteBatch, prePayPlanSubmit, prePayPlanExport } from '@/api/warehouse/prePayPlan'
import DetailsDialog from "./components/detailsDialog"
import MatlDialog from "./components/matlDialog"

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
    pageSize: 30
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
  prePayPlanList(params).then(({ data }) => {
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

const handleDelete = () => {
  if(isIdsFun()){
    proxy.$modal.confirm('确定要删除吗？').then(()=>{
      return prePayPlanDeleteBatch({ids: ids.value})
    }).then( ({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handleSubmit = () => {
  if(isIdsFun() && isStatusFun('0', '单据状态为已提交，不允许提交')){ 
    proxy.$modal.confirm('您确定要提交所选待付款计划单吗？').then(() => {
      return prePayPlanSubmit({planMtIds: ids.value})
    }).then(({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handleButtonClick = (code, data) => {
  const eventObj = {
    // 新增
    create: () => {
      proxy.$modal.loading()
      prePayPlanCreate().then(() => {
        getList()
      }).finally( () => {
        proxy.$modal.closeLoading()
      })
    },
    // 删除
    delete: () => {
      handleDelete()
    },
    // 提交
    submit: () => {
      handleSubmit()
    },
    // 导出
    export: () => {
      const params = proxy.addDateRange(queryParams.value, queryParams.value.createDate, 'createDate')
      proxy.$download.name(prePayPlanExport, params)
    },
    viewMatl: () => {
      proxy.$refs.matlDialog.show(data?.row)
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