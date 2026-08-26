<!-- 采购订单发货批次查询 -->
<template>
    <div class="app-container app-container-splitpanes">
        <el-pro-table ref="proTableRef" :columns="columnsData" :page-size="queryParams.pageSize" 
            :toolbar-config="toolbarConfig" :search-collapse-threshold="5" @action="onAction" :data="tableData"
            :total="total" @search="onSearch"  table-id="purchase-order" :show-checkbox="true"
            :grid-options="{ rowId: 'pddId' }" />
         <DetailDialog v-model="playBatchVisible" :rowData="rowData" />       
    </div>
</template>

<script setup name="purchase-order">
import DetailDialog from "./components/DetailDialog.vue"
import { paramConfigList, orderListExport, getUnitList, selectListWithoutLogin } from '@/api/materialAccept/purchaseOrder'
import { getCookie } from '@/utils/auth'
import { columns } from './tableJson'
const columnsData = ref([])
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

        },
        {
            code: 'detail',
            name: '查看验收历史',
            type: 'primary',
            showInTop: false,
            showInRow: true,
        },
    ]
}

const { proxy } = getCurrentInstance()
const tableData = ref([])
const loading = ref(false)
const total = ref(0)

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
    if (params?.makeDate) delete params.makeDate
    const form = proTableRef.value?.getSearchForm?.()
    const paramsObj = proxy.addDateRange({ ...params, ...pageConfig }, form.makeDate, 'makeDate')
    queryParams.value = paramsObj
    getList()
}

const playBatchVisible = ref(false)
const rowData = ref({})

// const getUnitListData = async () => {
//     let { data } = await getUnitList({
//         unitFlag: "1",
//         parentUnitCode: getCookie('railwayCode'),
//     })
//     return data.map(item => {
//         return {
//             label: item.unitName,
//             value: item.unitCode,
//             ...item
//         }
//     })
// }
// const selectListWithout = async (val) => {
//     let { data } = await selectListWithoutLogin({
//         unitCode: val
//     })
//     return data.map(item => {
//         return {
//             label: item.plantName,
//             value: item.plantCode,
//             ...item
//         }
//     })
// }
const onAction = ({ code, row, selectedRows }) => {
    const eventObj = {
        export: () => {
            const form = proTableRef.value?.getSearchForm?.()
            const params = proxy.addDateRange(Object.assign({}, form, { ids: selectedRows.map(item => item.pddId)?.join(',') }))
            proxy.$download.name(orderListExport, params)
        },
        detail: () => {
            playBatchVisible.value = true
            rowData.value = row
        },
    }
    eventObj[code] && eventObj[code]()
}

onMounted(async () => {
    columnsData.value = await columns()
    getList()
})


</script>
<style lang="scss"></style>