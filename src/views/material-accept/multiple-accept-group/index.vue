<!-- 多次验收分组维护 -->
<template>
  <div class="app-container app-container-splitpanes">
    <el-pro-table ref="proTableRef" :columns="columns" :page-size="queryParams.pageSize" 
      :toolbar-config="toolbarConfig" :search-collapse-threshold="3" @action="onAction" :data="tableData" :total="total"
      @search="onSearch"  table-id="multiple-accept-group" />
    <add-dialog ref="addDialog" @createSuccess="getList()" />
    <personnel-dialog ref="personnelRef" @createSuccess="getList()" />
  </div>
</template>
<script setup name="multiple-accept-group">
import AddDialog from "./components/AddDialog"
import PersonnelDialog from "./components/PersonnelDialog.vue"
import { paramConfigList, getGroupdelete } from '@/api/materialAccept/acceptGroup'
import { columns } from './tableJson'


const { proxy } = getCurrentInstance()
const proTableRef = shallowRef(null)
const tableData = ref([])
const loading = ref(false)
const total = ref(0)


const queryParams = ref({
  pageNum: 1,
  pageSize: 30
})


//按钮配置项
const toolbarConfig = {
  buttons: [
    {
      code: 'add',
      name: '新增',
      type: 'primary',
      showInTop: true,
    },
    {
      code: 'edit',
      name: '编辑',
      type: 'primary',
      showInTop: false,
      showInRow: true,
    },
    {
      code: 'personnel',
      name: '分配人员',
      type: 'primary',
      showInTop: false,
      showInRow: true,
    },
    {
      code: 'delete',
      name: '删除',
      type: 'primary',
      showInTop: false,
      showInRow: true,
    },
  ]
}

const onAction = ({ code, row }) => {
  const eventObj = {
    add: () => {
      proxy.$refs["addDialog"].show('create')
    },
    edit: () => {
      proxy.$refs["addDialog"].show('modify', row)
    },
    personnel: () => {
      proxy.$refs["personnelRef"].show(row)
    },
    delete: () => {
      proxy.$modal.confirm('是否要删除数据？').then(() => {
        getGroupdelete(row.id).then(({ message }) => {
          proxy.$modal.msgSuccess(message)
          getList()
        })
      })
    }
  }
  eventObj[code] && eventObj[code]()
}

/** 查询角色列表 */
const getList = async () => {
  loading.value = true
  paramConfigList(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}
const onSearch = (params, pageConfig) => {
    queryParams.value = { ...params, ...pageConfig }
    getList()
}
onMounted(() => {
  getList()
})

</script>
<style lang="scss"></style>