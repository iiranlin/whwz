<template>
  <ep-dialog class="dialog" title="选择物资明细" :close-on-click-modal="false" :append-to-body="true" v-model="visible" width="1150px">
    <div class="sso-front-table-container app-container">
      <form-data ref="elForm" :showSearch="showSearch" :formJson="selectMatlFormJson" @handleQuery="handleQuery" :isShowMore="false"
        @resetQuery="resetQuery"></form-data>
      <!-- 表格数据 -->
      <table-index class="table-index" :tableJson="selectMatlTableJson" @handleSelectionChange="handleSelectionChange"
        idName="matlCode" :tableData="tableData" @handleButtonClick="handleButtonClick">
      </table-index>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;返回</el-button>
        <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;确定</el-button>
      </div>
    </template>
  </ep-dialog>

</template>
<script setup>
import { selectMatlFormJson } from "../formJson"
import { selectMatlTableJson } from "../tableJson"
import { noAuthorizeList } from '@/api/system/common'
import { warehouseLocationMatlCreate } from '@/api/warehouse/warehouseLocation'

const { proxy } = getCurrentInstance()

// 接收参数并指定类型（可选）
const props = defineProps({
  dialogRow: {
    type: Object,
    default: null
  }
})

const visible = ref(false)

const ids = ref([])
const selectionArr = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const showSearch = ref(true)

const data = reactive({
  tableData: [],
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    positionType: ''
  }
})

const { tableData, queryParams } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

const getList = () => {
  proxy.$modal.loading()
  noAuthorizeList(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total || 0
  }).finally(() => {
    proxy.$modal.closeLoading()
  })
}

// 显示弹框
function show(row) {
  queryParams.value.positionType = row.positionType
  visible.value = true
  tableData.value = []
  total.value = 0
  proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetQuery()
	})
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  selectionArr.value = selection
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

const handleQuery = (data) => {
  queryParams.value.pageNum = 1
  queryParams.value = Object.assign({}, queryParams.value, data)
  getList()
}

/** 重置按钮操作 */
const resetQuery = (data) => {
  handleQuery(data)
}

const handleButtonClick = (code, { row }) => {

}

const saveBtn = () => {
  if(!selectionArr.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  const selectionData = selectionArr.value.map(item => {
    return {...item, locationId: props.dialogRow.id}
  })
  proxy.$modal.loading()
  warehouseLocationMatlCreate(selectionData).then( ({message}) => {
    proxy.$modal.msgSuccess(message)
    visible.value = false
    emit('createSuccess')
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
.dialog.ep-dialog{
  .sso-front-table-container{
    height: 500px !important;
  }
  .app-container{
    padding-top: 0 !important;
  }
}
.form-right{
  height: 50px;
}
</style>