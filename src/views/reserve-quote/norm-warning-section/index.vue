<!-- 储备定额预警(站段)  -->
<template>
    <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" :columns="columnsData" :page-size="queryParams.pageSize"
            :toolbar-config="toolbarConfig" :search-collapse-threshold="5" @action="onAction" :data="tableData"
            :total="total" @search="onSearch" table-id="norm-warning-section" :show-checkbox="true"
            :grid-options="{ rowId: 'mtId' }" :show-action="false" />
            </el-col>
        </el-row>
    </div>
</template>
<script setup name="norm-warning-section">
import { normListPageWarning, plantDictList, warehouseDict, normListExportWarning } from '@/api/reserve-quote/section'
const { proxy } = getCurrentInstance()
const tableData = ref([])
const loading = ref(false)
const total = ref(0)
import { columns } from './tableJson'
const columnsData = ref([])
const queryParams = ref({
    pageNum: 1,
    pageSize: 30
})

const proTableRef = shallowRef(null)

const toolbarConfig = {
    buttons: [
        {
            code: 'export',
            name: '导出',
            type: 'primary',
            showInTop: true,

        },

    ]
}
const onAction = ({ code, row, selectedRows }) => {
    const eventObj = {
        export: () => {
            const form = proTableRef.value?.getSearchForm?.()
            const params = proxy.addDateRange(Object.assign({}, form, { mtId: selectedRows.map(item => item.mtId)?.join(',') }))
            proxy.$download.name(normListExportWarning, params)
        },
    }
    eventObj[code] && eventObj[code]()
}

/** 查询角色列表 */
const getList = async () => {
    loading.value = true
    normListPageWarning(queryParams.value).then(({ data }) => {
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
const init = async () => {
    columnsData.value = await columns()
}
onMounted(() => {
     init()
    getList()
})

</script>
<style lang="scss" scoped></style>