<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="80" :page-size="30" :data="tableData"
          :total="total" :columns="columns" show-checkbox click-row-to-toggle-selection :table-alert-render="false"
          :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
          @action="onAction" @selection-change="onSelectionChange">
        </el-pro-table>
      </el-col>
    </el-row>

    <add-dialog ref="addDialog" @createSuccess="getList()" />
  </div>
</template>

<script setup name="equip-part">
import { columns, toolbarConfig } from "./tableJson"
import AddDialog from "./components/AddDialog"
import { equipPartList, equipPartDeleteBatch } from '@/api/warehouse/equipPart'

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('id')
const ids = ref([])
const total = ref(0)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  }
})

const { queryParams } = toRefs(data)

/** 查询角色列表 */
function getList() {
  loading.value = true
  equipPartList(queryParams.value).then(({ data }) => {
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

const handleDelete = () => {
  if(!ids.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  proxy.$modal.confirm('确定要删除吗？').then(()=>{
    equipPartDeleteBatch({ids: ids.value}).then( ({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  })
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
    }
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>