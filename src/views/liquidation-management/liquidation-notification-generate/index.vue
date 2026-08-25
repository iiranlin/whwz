<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="160" :page-size="30" :show-action="false" :data="tableData"
          :total="total" :columns="columns" show-checkbox click-row-to-toggle-selection :table-alert-render="false"
          :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
          @action="onAction" @selection-change="onSelectionChange">
        </el-pro-table>
      </el-col>
    </el-row>
    <back-dialog ref="backDialog" />
    <pre-pay-create-dialog ref="prePayCreateDialog" @success="getList" />
  </div>
</template>

<script setup name="liquidation-notification-generate">
import { columns, toolbarConfig } from "./tableJson"
import { payMtToNoticeList, prePayBackToCheck } from '@/api/warehouse/prePay'
import BackDialog from "@/views/liquidation-management/wait-liquidation-material-check/components/backDialog"
import PrePayCreateDialog from "./components/prePayCreateDialog"
import { generateUUID } from '@/utils'

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('uid')
const ids = ref([])
const selectionData = ref([])
const total = ref(0)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  },
})

const { queryParams } = toRefs(data)

/** 查询列表 */
function getList() {
  const params = proxy.addDateRange(queryParams.value, queryParams.value.createDate, 'createDate')
  loading.value = true
  payMtToNoticeList(params).then(({ data }) => {
    tableData.value = (data.list || []).map(item => {return {...item, uid: generateUUID()}})
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

/** 多选框选中数据 */
function onSelectionChange(selection) {
  selectionData.value = selection
  ids.value = selection.map(item => item[idName.value])
}

const isIdsFun = () => {
  if(!selectionData.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return false
  }
  return true
}

const handlePayCreate = (type) => {
  if((type == 'payCreateAll' || isIdsFun())){
    const params = proxy.addDateRange(queryParams.value, queryParams.value.createDate, 'createDate')
    proxy.$refs.prePayCreateDialog.show(type, selectionData.value, params)
  }
}

const handleBack = () => {
  if(isIdsFun()){
    const ids = selectionData.value.map(a => a.id)
    proxy.$modal.confirm('确定要回退吗？').then(()=>{
      return prePayBackToCheck({ids})
    }).then( ({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handleClickLink = (code, data) => {
  const eventObj = {
    // 详情
    prePayNo: () => {
      proxy.$refs.backDialog.show('details', data, 'checkStatus')
    }
  }
  eventObj[code] && eventObj[code]()
}

const onAction = (payload) => {
  const { name, code, row, files } = payload
  const eventObj = {
    payCreate: () => {
      handlePayCreate('payCreate')
    },
    payCreateAll: () => {
      handlePayCreate('payCreateAll')
    },
    back: () => {
      handleBack()
    },
    link: () => {
      handleClickLink(name, row)
    }
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>