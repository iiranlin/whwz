<!-- 储备定额维护(路局)  -->
<template>
    <div class="app-container app-container-splitpanes">
        <el-pro-table ref="proTableRef" :columns="columns" :page-size="queryParams.pageSize"
            :toolbar-config="toolbarConfig" :search-collapse-threshold="5" @action="onAction" :data="tableData"
            :total="total" @search="onSearch" table-id="reserve-quote-maintenance" :show-checkbox="true"
            :grid-options="{ rowId: 'mtId' }" />
        <add-dialog v-model="visible" :rowData="rowData" @createSuccess="createSuccess" />
    </div>
</template>
<script setup name="reserve-quote-maintenance">
import AddDialog from "./components/AddDialog"
import { normListPage, normListDeleteBatch, normListPublish, normListCancelPublish, normListExport, getUnitList } from '@/api/reserve-quote/maintenance'
import { getCookie } from '@/utils/auth'

const { proxy } = getCurrentInstance()
const tableData = ref([])
const loading = ref(false)
const total = ref(0)
const columns = createRichColumns()
const queryParams = ref({
    pageNum: 1,
    pageSize: 30
})

const proTableRef = shallowRef(null)
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
function createRichColumns(overrides = {}) {
    const cols = [
        {
            field: 'year',
            title: '年份',
            searchable: true,
            searchType: 'date',
            searchProps: { type: 'year', valueFormat: 'YYYY' },
        },
        {
            field: 'unitCode',
            title: '单位',
            showOverflowTooltip: true,
            searchable: true,
            hideInTable: true,
            searchType: 'select',
            requestOptions: () => getUnitListData(),
        },
        {
            field: 'unitCode',
            title: '单位编号',
            showOverflowTooltip: true,
            searchable: false,
            searchType: 'input',
        },
        {
            field: 'unitName',
            title: '单位名称',
            showOverflowTooltip: true,
            searchable: false,
        },
        {
            field: 'rationAmount',
            title: '定额（元）',
            showOverflowTooltip: true,
            searchable: false,
            searchType: 'input',
        },
        {
            field: 'flag',
            title: '状态',
            showOverflowTooltip: true,
            searchable: true,
            searchType: 'select',
            options: [
                { label: '未发布', value: '1' },
                { label: '已发布', value: '2' },
            ],
        },
    ]
    return cols.map((col) => {
        const patch = overrides[col.field]
        return patch ? { ...col, ...patch } : col
    })
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
            const deleteId = selectedRows.filter(item => item.flag === '1').map(items => items.mtId)
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
            const releaseId = selectedRows.filter(item => item.flag === '1').map(items => items.mtId)
            if (releaseId.length === 0) {
                proxy.$modal.msgWarning('请选择未发布的数据进行操作！')
                return
            }
            normListPublish({ ids: releaseId }).then(({ message }) => {
                proxy.$modal.msgSuccess(message)
                getList()
            })
        },
        cancelPublish: () => {
            if (selectedRows.length === 0) {
                proxy.$modal.msgWarning('请选择至少一条数据')
                return
            }
            const revokeId = selectedRows.filter(item => item.flag === '2').map(items => items.mtId)
            if (revokeId.length === 0) {
                proxy.$modal.msgWarning('请选择已发布的数据进行操作！')
                return
            }
            normListCancelPublish({ ids: revokeId }).then(({ message }) => {
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
            const params = proxy.addDateRange(Object.assign({}, form, { mtId: selectedRows.map(item => item.mtId)?.join(',') }))
            proxy.$download.name(normListExport, params)
        },
    }
    eventObj[code] && eventObj[code]()
}

/** 查询角色列表 */
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
const getUnitListData = async () => {
    const { data } = await getUnitList({
        unitFlag: "1",
        parentUnitCode: getCookie('railwayCode'),
    })
    return data.map(item => {
        return {
            label: item.unitName,
            value: item.unitCode,
            ...item
        }
    })
}
const createSuccess = () => {
    getList()
}
onMounted(() => {
    getList()
})

</script>
<style lang="scss" scoped></style>