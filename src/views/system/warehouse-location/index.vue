<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="120" :page-size="30" :data="tableData"
          :total="total" :columns="columnsData" show-checkbox click-row-to-toggle-selection :table-alert-render="false"
          :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
          @action="onAction" @selection-change="onSelectionChange">
        </el-pro-table>
      </el-col>
    </el-row>

    <add-dialog ref="addDialog" @createSuccess="getList()" />

    <allocate-matl-dialog ref="allocateMatlDialog" @allocateSuccess="getList()" />
    <print-dialog ref="printDialog" />
  </div>
</template>

<script setup name="warehouse-location">
import { columns, toolbarConfig } from "./tableJson"
import AddDialog from "./components/AddDialog"
import AllocateMatlDialog from "./components/allocateMatlDialog"
import PrintDialog from "./components/PrintDialog"
import { locationList, locationDeleteBatch, locationDownloadTemplate, warehouseLocationImport } from '@/api/warehouse/warehouseLocation'

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('id')
const ids = ref([])
const selectionData = ref([])
const total = ref(0)
const columnsData = ref([])

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  }
})

const { queryParams } = toRefs(data)

async function init () {
  columnsData.value = await columns()
}
init()

/** 查询角色列表 */
function getList() {
  loading.value = true
  locationList(queryParams.value).then(({ data }) => {
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

const handleDelete = () => {
  if(!ids.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  proxy.$modal.confirm('确定要删除吗？').then(()=>{
    locationDeleteBatch({ids: ids.value}).then( ({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  })
}

const handlePrint = () => {
  if(!ids.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  const isDistribute = selectionData.value.some(a => a.isDistribute != '1')
  if(isDistribute){
    proxy.$modal.msgWarning('请选择已分配物资的数据')
    return
  }
  proxy.$refs.printDialog.show(ids.value)
}

const handleDownload = () => {
  proxy.$download.name(locationDownloadTemplate)
}

const onAction = (payload) => {
  const { code, row, selectedRows, files } = payload
  const eventObj = {
    // 新增
    create: () => {
      proxy.$refs["addDialog"].show('create')
    },
    // 修改
    modify: () => {
      proxy.$refs["addDialog"].show('modify', row)
    },
    // 删除
    delete: () => {
      handleDelete()
    },
    // 分配物资
    allocateMatl: () => {
      proxy.$refs["allocateMatlDialog"].show(row)
    },
    // 下载模板
    download: () => {
      handleDownload()
    },
    // 模板导入
    upload: () => {
      warehouseLocationImport(files[0]).then( ({data}) => {
        proxy.$modal.msgSuccess(`成功导入${data}条！`)
        getList()
      })
    },
    // 打印
    print: () => {
      handlePrint()
    }
  }
  eventObj[code] && eventObj[code]()
}


getList()
</script>
<style lang="scss" scoped>
.app-container-file-upload{
  display: inline-block;
  line-height: normal;
  padding: 0 12px;
  :deep(.upload-file-uploader){
    margin-bottom: 0;
  }
  :deep(.ep-button){
    line-height: 1.15;
    height: 30px;
  }
}
</style>