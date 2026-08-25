<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="100" :page-size="10" :data="tableData"
          :total="total" :columns="columns" :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName }"
          :table-id="menuId" @search="onSearch" @action="onAction">
        </el-pro-table>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="download-center">
import { columns, toolbarConfig } from "./tableJson"
import { exportTaskMyPage } from '@/api/base/exportTask'
import { downloadFileUrl } from '@/api/base/minio'

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('id')
const total = ref(0)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10
  }
})

const { queryParams } = toRefs(data)

/** 查询列表 */
function getList() {
  loading.value = true
  exportTaskMyPage(queryParams.value).then(({ data }) => {
    tableData.value = data.list || data.records || []
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

/** 按钮事件 */
const onAction = (payload) => {
  const { code, row } = payload
  const eventObj = {
    refresh: () => {
      getList()
    },
    download: () => {
      downloadFileUrl(row)
    }
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>
