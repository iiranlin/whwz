<template>
  <ep-dialog class="ep-dialog-list" :title="dialogType != 'details'?'清算核对' : '待清算物资明细'" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body>
    <div class="app-container">
      <el-form class="form-wrapper" :model="rowData" ref="elForm" label-width="140px"> 
        <div class="form-left flex1">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="prePayNo" label="待清算物料明细单号：">
                <span>{{ rowData.prePayNo }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="清算周期：">
                <span>{{ parseTime(rowData.noteDateBegin, "{y}-{m}-{d}") }} - {{ parseTime(rowData.noteDateEnd, "{y}-{m}-{d}") }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用料单位名称：">
                <span>{{ rowData.useUnitName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商名称：">
                <span>{{ rowData.supplierName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="核对状态：">
                <span>{{ checkStatusObj[rowData.checkStatus] }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="comments" label="备注：">
                <span>{{ rowData.comments }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <el-divider style="margin-top: 0;"/>
      <form-data ref="formDataRef" inputWidth="180" :buttonClass="false" :isShowMore="false" :queryParams="queryParams" :showSearch="showSearch" :formJson="matlFormJson" @handleQuery="handleQuery"
        @resetQuery="resetQuery" labelWidth="100" v-show="dialogType != 'details'"></form-data>
      <button-top :buttonJson="matlTableButtonJson" @handleButton="handleButtonClick" v-if="dialogType != 'details'"></button-top>
      <!-- 表格数据 -->
      <table-index class="table-index" :selectionShow="dialogType != 'details'" :tableJson="matlTableJson" :tableButtonJson="matlTableButtonJson" :tableData="tableData"
        :idName="idName" @handleSelectionChange="handleSelectionChange" @handleButtonClick="handleButtonClick">
        <template #matlType="{ scope }">
          <span>{{`${scope.row.matlType}${scope.row.matlRaw?'/'+scope.row.matlRaw:''}${scope.row.matlpCode?'/'+scope.row.matlpCode:''}`}}</span>
        </template>
      </table-index>
      <div class="page-bottom">
        <el-descriptions class="page-bottom-descriptions">
          <el-descriptions-item label="订单总金额(含税)：">{{ rowData.sumAmount || 0 }}</el-descriptions-item>
        </el-descriptions>
        <pagination class="page-bottom-pagination" v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize" @pagination="getList" />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
      </div>
    </template>
    <saveInvoiceFiles ref="saveInvoiceFiles" @success="saveInvoiceFilesSuccess" />
  </ep-dialog>
</template>

<script setup>
import { prePayDtWithInvoice, prePayCheck } from '@/api/warehouse/prePay'
import { matlFormJson } from "../formJson"
import { matlTableJson, matlTableButtonJson } from "../tableJson"
import { checkStatusObj } from '@/utils/dictionary'
import SaveInvoiceFiles from "./saveInvoiceFiles"
const { proxy } = getCurrentInstance()

const props = defineProps({
  mtId: {
    type: String,
    default: 'id'
  }
})

const visible = ref(false)
const dialogType = ref('back')
const tableData = ref([])
const total = ref(0)
const showSearch = ref(true)
const idName = ref('pddId')
const ids = ref([])
const selectionData = ref([])
const dataCode = ref('')


const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  },
  rowData: {
    prePayNo: '',
    plantCode: '',
    plantName: '',
    depotCode: '',
    depotId: '',
    depotName: '',
    partitionCode: '',
    partitionName: '',
    supUnitCode: '',
    supUnitName: '',
    comments: ''
  }
})

const { queryParams, rowData} = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['success']);

const getList = () => {
  let params = {...queryParams.value, mtId: rowData.value[props.mtId]}
  if(dataCode.value){
    params = {...queryParams.value, mtId: rowData.value[props.mtId], [dataCode.value]: rowData.value[dataCode.value]}
  }
  proxy.$modal.loading()
  prePayDtWithInvoice(params).then(({data}) => {
    tableData.value = data.list || []
    total.value = data.total || 0
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
}

// 显示弹框
function show(type = 'back', row = {}, code = '') {
  visible.value = true
  dialogType.value = type
  dataCode.value = code
  tableData.value = []
  rowData.value = row
  proxy.$nextTick(() => {
    proxy.$refs.formDataRef && proxy.$refs.formDataRef.resetQuery()
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
}

const isIdsFun = () => {
  if(!ids.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return false
  }
  return true
}

const isInvoiceCodeListFun = (type, name) => {
  const isFlag = type == '1'?selectionData.value.some(a => !!a.invoiceCodeList):selectionData.value.some(a => !a.invoiceCodeList)
  if(isFlag){
    proxy.$modal.msgWarning(name)
    return false
  }
  return true
}

const isCheckStatus = () => {
  const isFlag = selectionData.value.some(a => a.checkStatus == '1')
  if(isFlag){
    proxy.$modal.msgWarning('入库单已核对，请选择未核对的数据')
    return false
  }
  return true
}

const handleButtonClick = (code, data) => {
  const eventObj = {
    // 发票附件补传
    invoiceUpload: () => {
      const isFlag = selectionData.value.some(a => a.checkStatus == '1')
      if(isIdsFun() && isCheckStatus()){
        proxy.$refs.saveInvoiceFiles.show( 'invoiceUpload', ids.value)
      }
    },
    check: () => {
      handleCheck()
    },
    // 查看发票附件
    viewInvoice: () => {
      proxy.$refs.saveInvoiceFiles.show('viewInvoice', [data?.row.pddId])
    },
  }
  eventObj[code] && eventObj[code]()
}

const saveInvoiceFilesSuccess = () => {
  getList()
}

const handleCheck = () => {
  if(isIdsFun() && isInvoiceCodeListFun(2, '入库单未关联发票信息，不能核对。') && isCheckStatus()){
    proxy.$modal.confirm('确定要核对吗？').then( () => {
      const dtIds = selectionData.value.map(a => a.id)
      proxy.$modal.loading()
      prePayCheck({id: rowData.value.id, dtIds}).then( ({message}) => {
        proxy.$modal.msgSuccess(message)
        getList()
        emit('success')
      }).finally( () => {
        proxy.$modal.closeLoading()
      })
    })
  }
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
.ep-dialog-list{
  .form-data{
    border-bottom: 0;
  }
  .page-bottom{
    display: flex;
    flex-direction: row-reverse;
    .page-bottom-pagination{
      flex: 1;
    }
    .page-bottom-descriptions{
      margin-top: 10px;
      :deep(.ep-descriptions__body){
        margin-top: 6px;
      }
    }
  }
}
</style>