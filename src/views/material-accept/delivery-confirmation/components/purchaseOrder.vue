<template>
  <div class="el-tabs-main">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="180" :page-size="30" :data="tableData"
          :default-search-form="defaultSearchForm" :editable="editableConfig" @cell-change="handleCellChange"
          :total="total" :columns="columns" show-checkbox click-row-to-toggle-selection :table-alert-render="false" :show-action="name === 'purchaseOrder'"
          :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
          @action="onAction" @selection-change="onSelectionChange">
          <template #matlTypeSlot="{ row }">
            <span>{{`${row.matlType}${row.matlRaw?'/'+row.matlRaw:''}${row.matlpCode?'/'+row.matlpCode:''}`}}</span>
          </template>
        </el-pro-table>

      </el-col>
    </el-row>

    <add-dialog ref="addDialog" @createSuccess="getList" />
    <restock-dialog ref="restockDialog" @restockSuccess="getList" />
    <certificate-dialog ref="certificateDialog" />
  </div>
</template>

<script setup>
import AddDialog from "./AddDialog"
import RestockDialog from "./restockDialog"
import CertificateDialog from "./certificateDialog"
import { useDict } from "@/utils/Dict"

// 接收参数并指定类型（可选）
const props = defineProps({
  name: {
    type: String,
    default: 'purchaseOrder'
  },
  columns: {
    type: Array,
    default: []
  },
  toolbarConfig: {
    type: Object,
    default: {}
  },
  urlApi: {
    type: Object,
    default: null
  },
  idName: {
    type: String,
    default: 'pdbId'
  },
  menuId: {
    type: String,
    default: ''
  },
})

const { proxy } = getCurrentInstance()

const menuId = ref(props.menuId || proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const ids = ref([])
const selectionData = ref([])
const total = ref(0)

const data = reactive({
  defaultSearchForm: {
    confirmFlag: '0',
    flag: '1'
  },
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    confirmFlag: '0',
    flag: '1'
  },
  tableDataDict: {
    fundSource: {},
    taxablePurpose: {}
  }
})

const { queryParams, tableDataDict, defaultSearchForm } = toRefs(data)

const { dictMap } = useDict('matl_use')
const { dictMap: taxablePurposeDict } = useDict('tax_flag')
tableDataDict.value.fundSource = dictMap
tableDataDict.value.taxablePurpose = taxablePurposeDict


const editableConfig = computed(() => ({
  enabled: true,
  mode: 'multiple',
  defaultEditAll: true,
  isColumnEditable: (column, row) => {
    if (column.field === 'arrivalNum') return props.idName == 'pdbId'?row.confirmFlag == '0' : row.flag == '1'
    return true
  },
}))

/** 查询角色列表 */
function getList() {
  const params = props.name == 'purchaseOrder'?proxy.addDateRange(queryParams.value, queryParams.value.deliverDate, 'deliverDate'):proxy.addDateRange(queryParams.value, queryParams.value.finishDate, 'finishDate')
  delete params.finishDate
  delete params.deliverDate
  loading.value = true
  props.urlApi[`${props.name}List`](params).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

/** 搜索按钮操作 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo }
  getList()
}

// 采购订单确认
const handleConfirm = () => {
  if(!ids.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  const isFlag = selectionData.value.some(a => props.idName == 'pdbId'?a.confirmFlag != '0' : a.flag != '1')
  if(isFlag){
    proxy.$modal.msgWarning('请选择未确认订单')
    return
  }
  proxy.$modal.confirm('您确定要到货确认所选订单吗？').then( async ()=>{
    const params = selectionData.value.map(a => {
      return {[props.idName]: a[props.idName], arrivalNum: a.arrivalNum}
    })
    const res = await props.urlApi[props.name == 'purchaseOrder'?'purchaseOrderCheckSupplier':'gtOrderCheckSupplier']({params})
    if(!res.data){
      apiConfirm(params)
      return
    }
    proxy.$modal.confirm(res.message).then(()=>{
      apiConfirm(params)
    })
  })
}

const apiConfirm = (params) => {
  props.urlApi[`${props.name}Confirm`]({params}).then( ({message}) => {
    proxy.$modal.msgSuccess(message)
    getList()
  })
}

// 采购订单撤回
const handleRevoke = () => {
  if(!ids.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  const isConfirmFlag = selectionData.value.some(a => a.confirmFlag != '1')
  if(isConfirmFlag){
    proxy.$modal.msgWarning('请选择已确认订单')
    return
  }
  proxy.$modal.confirm('您确定要撤回所选订单吗？').then(()=>{
    props.urlApi?.purchaseOrderRevoke({pdbIds: ids.value}).then( ({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  })
}

/** 多选框选中数据 */
function onSelectionChange(rows) {
  selectionData.value = rows
  ids.value = rows.map(item => item[props.idName])
}

const onAction = (payload) => {
  const { code, row, selectedRows, files } = payload
  const eventObj = {
    confirm: () => {
      handleConfirm()
    },
    revoke: () => {
      handleRevoke()
    },
    deactivate: () => {
      if(!ids.value.length){
        proxy.$modal.msgWarning('请选择数据')
        return
      }
      const flag1 = selectionData.value.some(a => a.flag != '1')
      if(flag1){
        proxy.$modal.msgWarning('请选择未确认订单')
        return
      }
      proxy.$refs["addDialog"].show(ids.value)
    },
    export: () => {
      const params = proxy.addDateRange(queryParams.value, queryParams.value.finishDate, 'finishDate')
      delete params.finishDate
      proxy.$download.name(props.urlApi?.gtOrderExport, params)
    },
    noticeRestock: () => {
      proxy.$refs.restockDialog.show(row)
    },
    certificateView: () => {
      proxy.$refs.certificateDialog.show(row.pdbId)
    }
  }
  eventObj[code] && eventObj[code]()
}

function handleCellChange({ rowId, editedData, row }) {
  if(!editedData.arrivalNum){
    row.arrivalNum = props.name == 'purchaseOrder'?row.deliverNum : row.skuNum
  }
}

getList()
</script>
<style lang="scss" scoped>
.el-tabs-main{
  height: 100%;
}
</style>