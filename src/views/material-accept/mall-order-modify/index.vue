<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="160" :page-size="30" :data="tableData"
          :total="total" :columns="columns" :table-alert-render="false"
          :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
          @action="onAction" @selection-change="onSelectionChange">
        </el-pro-table>
      </el-col>
    </el-row>

    <check-details-dialog ref="checkDetailsDialog" />

    <modify-dialog ref="modifyDialog" @updateSuccess="getList" />

  </div>
</template>

<script setup name="mall-order-modify">
import { columnsFun, toolbarConfig } from "./tableJson"
import { mtOrderData } from '@/api/warehouse/orderMt'
import CheckDetailsDialog from "./components/checkDetailsDialog"
import ModifyDialog from "./components/modifyDialog"


const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('orderId')
const ids = ref([])
const total = ref(0)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  },
})

const { queryParams } = toRefs(data)

const columns = ref([])

async function init () {
  const data = await columnsFun()
  columns.value = data
}
init()

const handleButtonDisable = (code, row) => {
  if(code === 'modify' && ['2'].includes(row.sfiniFlag)){
    return false
  }
  return true
}

/** 查询角色列表 */
function getList() {
  loading.value = true
  const params =  proxy.addDateRange(queryParams.value, queryParams.value.finishTime, 'finishTime')
  delete params.finishTime
  mtOrderData(params).then(({ data }) => {
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

/** 多选框选中数据 */
function onSelectionChange(rows) {
  ids.value = rows.map(item => item[idName.value])
}

const onAction = (payload) => {
  const { code, row, files } = payload
  const eventObj = {
    // 修改
    modify: () => {
      proxy.$refs.modifyDialog.show(row)
    },
    // 查看明细
    checkDetails: () => {
      proxy.$refs.checkDetailsDialog.show(row.id)
    }
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>