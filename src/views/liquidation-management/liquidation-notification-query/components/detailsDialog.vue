<template>
  <ep-dialog class="ep-dialog-list" title="清算通知书详情" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body>
    <div class="app-container">
      <el-form class="form-wrapper" :model="rowData" ref="elForm" label-width="140px"> 
        <div class="form-left flex1">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="prePayNoticeNo" label="清算通知书单号：">
                <span>{{ rowData.prePayNoticeNo }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用料单位名称：">
                <span>{{ rowData.useUnitName }}</span>
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
      <!-- 表格数据 -->
      <table-index class="table-index" :selectionShow="false" :tableJson="matlTableJson" :tableButtonJson="matltableButtonJson" :tableData="tableData" operationWidth="100"
        @handleButtonClick="handleButtonClick">
        <template #onlyTaxAmount="{ scope }">
          <span>{{ (scope.row.taxAmount - scope.row.noTaxAmount).toFixed(2) }}</span>
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
    <saveInvoiceFiles ref="saveInvoiceFiles" />
    <matlDialog ref="matlDialog" />
  </ep-dialog>
</template>

<script setup>
import { getNoticeDts } from '@/api/warehouse/prePay'
import { matlTableJson, matltableButtonJson } from "../tableJson"
import SaveInvoiceFiles from "@/views/liquidation-management/wait-liquidation-material-check/components/saveInvoiceFiles"
import MatlDialog from "./matlDialog"
const { proxy } = getCurrentInstance()

const visible = ref(false)
const tableData = ref([])
const total = ref(0)
const idName = ref('')

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
  proxy.$modal.loading()
  getNoticeDts({...queryParams.value, id: rowData.value[idName.value]}).then(({data}) => {
    tableData.value = data.list || []
    total.value = data.total || 0
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
}

// 显示弹框
function show(row = {}, id = 'id') {
  visible.value = true
  tableData.value = []
  rowData.value = row
  idName.value = id
  getList()
}

const handleButtonClick = (code, data) => {
  const eventObj = {
    viewInvoice: () => {
      proxy.$refs.saveInvoiceFiles.show('viewInvoice', data?.row.pddIdList)
    },
    viewMatl: () => {
      proxy.$refs.matlDialog.show(data?.row)
    },
  }
  eventObj[code] && eventObj[code]()
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