<!-- 退料单综合查询 -->
<template>
    <div class="app-container app-container-splitpanes">
        <el-pro-table ref="proTableRef" v-loading="loading" :columns="columnsData" :data="tableData"
            :params="queryParams" :toolbar-config="toolbarConfig" :page-size="queryParams.pageSize" :total="totalRow"
            :summary-data="summaryData" :sort-remote="false" :show-checkbox="true"
            :default-search-form="defaultSearchForm" :editable="false" :show-action="false" row-key="transfer-order"
            :table-alert-render="false" border @search="onSearch" @action="onAction"
            :grid-options="{ rowId: 'mtId', rowStyle: handleRowStyle }">
        </el-pro-table>
        <add-dialog ref="addDialog" @createSuccess="getList" />
    </div>
</template>
<script setup>
import { comprehensiveList, comprehensiveExport, comprehensivestatList } from '@/api/query/integrated-query'
import AddDialog from "@/views/rmstor/material-manage/material-maintain/components/AddDialogQuery"
import { getCookie } from '@/utils/auth'
import { columns, toolbarConfig } from "./tableJson"
const { proxy } = getCurrentInstance()
const proTableRef = shallowRef(null)
const tableData = ref([])
const queryParams = ref({
    pageNum: 1,
    pageSize: 30,

})
const loading = ref(false)
const columnsData = ref([])
const totalRow = ref(0)
const summaryData = ref()
const initDate = () => {
    const date = new Date(getCookie("warehouseYearMonth"));
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }
    return [formatDate(firstDay), formatDate(lastDay)]
}
const defaultSearchForm = {
    orderDate: initDate()
};
const onAction = ({ code, row, selectedRows }) => {
    const eventObj = {
        //详情
        link: () => {
            proxy.$refs.addDialog.show('details', row)
        },
        export: (row, selectedRows) => {
            const form = proTableRef.value?.getSearchForm?.()
            const paramsObj = proxy.addDateRange(queryParams.value, form.orderDate, 'orderDate')
            delete queryParams.value.orderDate
            proxy.$download.name(comprehensiveExport, paramsObj)
        },
    }
    eventObj[code] && eventObj[code]()
}

const getList = async () => {
    loading.value = true
    try {
        const form = proTableRef.value?.getSearchForm?.()
        const paramsObj = proxy.addDateRange(queryParams.value, form.orderDate, 'orderDate')
        delete queryParams.value.orderDate
        const { data, total } = await comprehensiveList(paramsObj)
        loading.value = false
        tableData.value = data.list
        totalRow.value = total
        comprehensivestatList(paramsObj).then(({ data }) => {
            summaryData.value = [
                { label: '数量：', value: data?.totalAmount || 0 },
                { label: '金额：', value: data?.totalNum || 0 },
            ]
        })
    } catch (error) {
        loading.value = false
    }
}
const onSearch = (params, pageConfig) => {
    const form = proTableRef.value?.getSearchForm?.()
    const paramsObj = proxy.addDateRange({ ...params, ...pageConfig }, form?.orderDate, 'orderDate')
    queryParams.value = paramsObj
    getList()
}
const handleRowStyle = ({ row }) => {
    // if (row.backFlag == "1") {
    //     return { color: "red" }
    // }
    // return {}
}

onMounted(async () => {
    columnsData.value = await columns()
    getList()
})
</script>
