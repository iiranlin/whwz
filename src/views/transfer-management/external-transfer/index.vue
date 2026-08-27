<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="160" :page-size="30" :max-visible-buttons="7" :data="tableData"
          :total="total" :columns="columnsData" show-checkbox click-row-to-toggle-selection :table-alert-render="false"
          :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName, rowStyle: handleRowStyle }" :table-id="menuId" @search="onSearch"
          @action="onAction" @selection-change="onSelectionChange">
        </el-pro-table>

      </el-col>
    </el-row>

    <create-dialog ref="createDialog" @createSuccess="getList" />
    
    <print-dialog ref="printDialog" />

    <delete-dialog ref="deleteDialog" @deleteSuccess="getList"/>

    <!-- <review-history-dialog ref="reviewHistoryDialog" /> -->

  </div>
</template>

<script setup name="external-transfer">
import { columns, toolbarConfig } from "./tableJson"
import { mainList, mainExport, mainSign, mainNote, mainCancelNote } from '@/api/warehouse/externalTransfer'
import CreateDialog from "./components/createDialog"
import PrintDialog from "./components/PrintDialog"
import DeleteDialog from "./components/deleteDialog"
// import ReviewHistoryDialog from "@/views/transfer-management/components/reviewHistoryDialog"

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('mtId')
const ids = ref([])
const selectionData = ref([])
const total = ref(0)
const columnsData = ref([])

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  },
  plantList: []
})

const { queryParams } = toRefs(data)

async function init () {
  const { columnsArr } = await columns()
  columnsData.value = columnsArr
}
init()

const handleRowStyle = ({row}) => {
  if(row.permFlag === '4'){
    return {color: 'red'}
  }
  return {}
}

/** 查询列表 */
function getList() {
  const params =  proxy.addDateRange(queryParams.value, queryParams.value.orderDate, 'orderDate')
  delete params.orderDate
  loading.value = true
  mainList(params).then(({ data }) => {
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
  selectionData.value = rows
  ids.value = rows.map(item => item[idName.value])
}

const isIdsFun = () => {
  if(!ids.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return false
  }
  return true
}

const isSaleFlagFun = (code = '0', name = '未登卡') => {
  const isSaleFlag = selectionData.value.some(a => a.saleFlag != code)
  if(isSaleFlag){
  proxy.$modal.msgWarning(`请选择${name}的数据`)
  return false
  }
  return true
}

const isPermFlagFun = (code = '0', name = '未审批') => {
  const isSaleFlag = selectionData.value.some(a => a.permFlag != code)
  if(isSaleFlag){
  proxy.$modal.msgWarning(`请选择${name}的数据`)
  return false
  }
  return true
}

const handleDelete = () => {
  if(isIdsFun() && isPermFlagFun()){
    proxy.$refs.deleteDialog.show(ids.value)
  }
}

const handleSubmit = () => {
  if(isIdsFun() && isSaleFlagFun() && isPermFlagFun()){
    proxy.$modal.confirm('您确定要报批所选订单吗？').then(() => {
      // 无工作流：直接报批，不走"选审批人"弹窗（$reviewerDialog），不再传 auditUserId
      // proxy.$reviewerDialog({
      //   billType: 'DWDBD',
      //   billIdList: ids.value,
      //   multiple: true,
      //   success: ({auditUserId}) => {
      mainSign({mtIdList: ids.value}).then(({message}) => {
        proxy.$modal.msgSuccess(message)
        getList()
      })
      //   }
      // })
    })
  }
}

const handleDenka = () => {
  if(isIdsFun() && isSaleFlagFun() && isPermFlagFun('2', '已审批')){
    proxy.$modal.confirm('您确定要登卡所选调拨(销售)单吗？').then(() => {
      return mainNote(ids.value)
    }).then(({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handleRevokeDenka = () => {
  if(isIdsFun() && isSaleFlagFun('1', '已登卡')){
    proxy.$modal.confirm('您确定要撤销登卡所选调拨(销售)单吗？').then(() => {
      return mainCancelNote(ids.value)
    }).then(({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handlePrint = () => {
  if(isIdsFun()){
    proxy.$refs.printDialog.show(ids.value)
  }
}

const onAction = (payload) => {
  const { code, name, row, files } = payload
  const eventObj = {
    // 新增
    create: () => {
      proxy.$refs.createDialog.show()
    },
    // 修改
    modify: () => {
      proxy.$refs.createDialog.show('modify', row)
    },
    // 删除
    delete: () => {
      handleDelete()
    },
    // 提交
    submit: () => {
      handleSubmit()
    },
    // 登卡
    denka: () => {
      handleDenka()
    },
    // 撤销登卡
    revokeDenka: () => {
      handleRevokeDenka()
    },
    history: () => {
      // 无工作流：隐藏"审核历史"入口（$flow 流程轨迹），将来接入工作流放开
      // proxy.$flow({bid: row.mtId})
      // proxy.$refs.reviewHistoryDialog.show(data.row)
    },
    // 打印
    print: () => {
      handlePrint()
    },
    // 导出
    export: () => {
      proxy.$download.name(mainExport, queryParams.value)
    },
    link: () => {
      handleClickLink(name, row)
    }
  }
  eventObj[code] && eventObj[code]()
}

const handleClickLink = (code, data) => {
  const eventObj = {
    // 详情
    outsaleCode: () => {
      proxy.$refs.createDialog.show('details', data)
    }
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>