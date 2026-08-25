<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="160" :page-size="30" :default-search-form="defaultSearchForm" :data="tableData"
          :total="total" :columns="columnsData" show-checkbox click-row-to-toggle-selection :table-alert-render="false"
          :toolbar-config="toolbarConfigData" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
          @action="onAction" @selection-change="onSelectionChange">
        </el-pro-table>
      </el-col>
    </el-row>

    <create-dialog ref="createDialog" :plantDictData="formSelectData.plantCode" @createSuccess="getList" />
    
    <print-dialog ref="printDialog" />

  </div>
</template>

<script setup name="quantity-outbound-maintain">
import { columns, toolbarConfig } from "./tableJson"
import { obmtList, obmtExport, obmtToCard, obmtCancelCard, obmtDeleteBatch } from '@/api/warehouse/obmt'
import CreateDialog from "./components/createDialog"
import PrintDialog from "./components/PrintDialog"

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('qobmtId')
const ids = ref([])
const selectionData = ref([])
const total = ref(0)
const columnsData = ref([])
const toolbarConfigData = ref({})

const data = reactive({
  defaultSearchForm: {
    flag: '0'
  },
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    flag: '0'
  },
  formSelectData: {
    plantCode: [],
  },
  plantList: []
})

const { queryParams, formSelectData, defaultSearchForm } = toRefs(data)

async function init () {
  const {plantArr, columnsArr} = await columns()
  formSelectData.plantCode = plantArr
  columnsData.value = columnsArr
  const data = await toolbarConfig()
  toolbarConfigData.value = data
}
init()

// const handleButtonDisable = (code, row) => {
  
//   if(['create', 'modify', 'delete'].includes(code) && isCloseFlag.value == '1'){
//     return false
//   }
  
//   if(['denka', 'revokeDenka'].includes(code) && (isCloseFlag.value == '1' || isStopnoteFlag.value == '1')){
//     return false
//   }

//   if(['modify'].includes(code) && !['0'].includes(row.flag)){
//     return false
//   }
//   return true
// }

/** 查询列表 */
function getList() {
  loading.value = true
  obmtList(queryParams.value).then(({ data }) => {
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

const isFlagFun = (code = '0', name = '未登卡') => {
  const isFlag = selectionData.value.some(a => a.flag != code)
  if(isFlag){
    proxy.$modal.msgWarning(`请选择${name}的数据`)
    return false
  }
  return true
}

const handleDelete = () => {
  if(isIdsFun() && isFlagFun('0', '未登卡')){
    proxy.$modal.confirm('确定要删除吗？').then(()=>{
      obmtDeleteBatch({ids: ids.value}).then( ({message}) => {
        proxy.$modal.msgSuccess(message)
        getList()
      })
    })
  }
}

const handleDenka = () => {
  if(isIdsFun() && isFlagFun('0', '未登卡')){
    proxy.$modal.confirm('您确定要登卡所选出库单吗？').then(() => {
      return obmtToCard(ids.value)
    }).then(({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handleRevokeDenka = () => {
  if(isIdsFun() && isFlagFun('1', '已登卡')){
    proxy.$modal.confirm('您确定要撤销登卡所选出库单吗？').then(() => {
      return obmtCancelCard(ids.value)
    }).then(({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  }
}

const handleClickLink = (code, data) => {
  const eventObj = {
    // 详情
    obBillCode: () => {
      proxy.$refs.createDialog.show('details', data)
    }
  }
  eventObj[code] && eventObj[code]()
}

const onAction = (payload) => {
  const { name, code, row, files } = payload
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
    // 登卡
    denka: () => {
      handleDenka()
    },
    // 撤销登卡
    revokeDenka: () => {
      handleRevokeDenka()
    },
    // 打印
    print: () => {
      proxy.$refs.printDialog.show(row[idName.value])
    },
    // 导出
    export: () => {
      proxy.$download.name(obmtExport, queryParams.value)
    },
    link: () => {
      handleClickLink(name, row)
    }
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>