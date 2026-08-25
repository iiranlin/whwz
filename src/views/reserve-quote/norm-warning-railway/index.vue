<!-- 储备定额预警(路局)  -->
<template>
    <div class="app-container app-container-splitpanes">
        <el-pro-table ref="proTableRef" :columns="columns" :page-size="queryParams.pageSize"
            :toolbar-config="toolbarConfig" :search-collapse-threshold="5" @action="onAction" :data="tableData"
            :total="total" @search="onSearch" table-id="norm-warning-railway" :show-checkbox="true"
            :grid-options="{ rowId: 'mtId' }" :show-action="false" />
    </div>
</template>

<script setup name="norm-warning-railway">
import { normListPage, normListExport, getUnitList } from '@/api/reserve-quote/railway'
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
            code: 'export',
            name: '导出',
            type: 'primary',
            showInTop: true,
            showInRow: false,
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
            field: 'isExceedRation',
            title: '超定额',
            showOverflowTooltip: true,
            searchable: true,
            hideInTable: true,
            searchType: 'select',
            options: [
                { value: '1', label: '是' },
                { value: '0', label: '否' }
            ],
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
            field: 'totalAmount',
            title: '库存总金额（元）',
            showOverflowTooltip: true,
            searchable: false,
            searchType: 'input',
        },
    ]
    return cols.map((col) => {
        const patch = overrides[col.field]
        return patch ? { ...col, ...patch } : col
    })
}
const onAction = ({ code, row, selectedRows }) => {
    const eventObj = {
        export: () => {
            const form = proTableRef.value?.getSearchForm?.()
            const params = proxy.addDateRange(Object.assign({}, form, { mtId: selectedRows.map(item => item.mtId)?.join(',') }))
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
const getUnitListData = async () => {
    let { data } = await getUnitList({
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
onMounted(() => {
    getList()
})

</script>
<style lang="scss" scoped></style>