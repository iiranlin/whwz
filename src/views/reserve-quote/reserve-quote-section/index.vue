<!-- 储备定额维护(站段)  -->
<template>
    <div class="app-container app-container-splitpanes">
        <el-pro-table ref="proTableRef" :columns="columnsData" :page-size="queryParams.pageSize" 
            :toolbar-config="toolbarConfig" :search-collapse-threshold="5" @action="onAction" :data="tableData"
            :total="total" @search="onSearch"  table-id="reserve-quote-section" :show-checkbox="true"
            :grid-options="{ rowId: 'dtId' }" />
        <add-dialog v-model="visible" :rowData="rowData" @createSuccess="createSuccess" />
    </div>
</template>
<script setup name="reserve-quote-section">
import AddDialog from "./components/AddDialog"
import {
    normListPage, normListDeleteBatch, normListPublish,
    normListExport, getUnitList, plantDictList, warehouseDict
} from '@/api/reserve-quote/section'

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
            code: 'add',
            name: '新增',
            type: 'primary',
            showInTop: true,

        },
        {
            code: 'delete',
            name: '删除',
            type: 'primary',
            showInTop: true,
            showInRow: false,
        },
        {
            code: 'publish',
            name: '发布',
            type: 'primary',
            showInTop: true,

        },
        {
            code: 'cancelPublish',
            name: '撤销发布',
            type: 'primary',
            showInTop: true,
            showInRow: false,
        },
        {
            code: 'export',
            name: '导出',
            type: 'primary',
            showInTop: true,

        },
        {
            code: 'edit',
            name: '编辑',
            type: 'primary',
            showInTop: false,
            showInRow: true,
            disabled: (row) => {
                if (row[0].flag === '1') {
                    return false
                } else {
                    return true
                }
            }
        },
    ]
}

const visible = ref(false)
const rowData = ref({})
const onAction = ({ code, row, selectedRows }) => {
    const eventObj = {
        add: () => {
            visible.value = true
            rowData.value = Object.assign({})
        },
        delete: () => {
            if (selectedRows.length === 0) {
                proxy.$modal.msgWarning('请选择至少一条数据')
                return
            }
            const deleteId = selectedRows.filter(item => item.flag === '1').map(items => items.dtId)
            if (deleteId.length === 0) {
                proxy.$modal.msgWarning('请选择未发布的数据进行操作！')
                return
            }
            proxy.$modal.confirm('是否要删除数据？').then(() => {
                normListDeleteBatch({ ids: deleteId }).then(({ message }) => {
                    proxy.$modal.msgSuccess(message)
                    getList()
                })
            })
        },
        publish: () => {
            if (selectedRows.length === 0) {
                proxy.$modal.msgWarning('请选择至少一条数据')
                return
            }
            const releaseId = selectedRows.filter(item => item.flag === '1').map(items => items.dtId)
            if (releaseId.length === 0) {
                proxy.$modal.msgWarning('请选择未发布的数据进行操作！')
                return
            }
            normListPublish(2, { ids: releaseId }).then(({ message }) => {
                proxy.$modal.msgSuccess(message)
                getList()
            })
        },
        cancelPublish: () => {
            if (selectedRows.length === 0) {
                proxy.$modal.msgWarning('请选择至少一条数据')
                return
            }
            const revokeId = selectedRows.filter(item => item.flag === '2').map(items => items.dtId)
            if (revokeId.length === 0) {
                proxy.$modal.msgWarning('请选择已发布的数据进行操作！')
                return
            }
            normListPublish(1, { ids: revokeId }).then(({ message }) => {
                proxy.$modal.msgSuccess(message)
                getList()
            })
        },
        edit: () => {
            visible.value = true
            rowData.value = row
        },
        export: () => {
            const form = proTableRef.value?.getSearchForm?.()
            const params = proxy.addDateRange(Object.assign({}, form, { mtId: selectedRows.map(item => item.dtId)?.join(',') }))
            proxy.$download.name(normListExport, params)
        },
    }
    eventObj[code] && eventObj[code]()
}

const getList = async () => {
    loading.value = true
    normListPage(queryParams.value).then(({ data }) => {
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
const createSuccess = () => {
    getList()
}
const init = async () => {
    columnsData.value = await columns
}
onMounted(() => {
     init()
    getList()
})
</script>
<style lang="scss" scoped></style>